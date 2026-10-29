#!/usr/bin/env bash
# Builds and deploys Casaguapo to AWS: the Concierge API (SAM) and the static site (S3 + CloudFront).
# Prerequisites: AWS CLI v2, SAM CLI, Node 22, credentials for the target account,
# and the Anthropic API key stored once in SSM (see README).
set -euo pipefail

STACK="${STACK_NAME:-casaguapo}"
REGION="${AWS_REGION:-us-east-1}"
# Optional custom domain: DOMAIN_NAME=www.example.com CERT_ARN=arn:aws:acm:us-east-1:... ./infra/deploy.sh
OVERRIDES=()
if [[ -n "${DOMAIN_NAME:-}" && -n "${CERT_ARN:-}" ]]; then
  OVERRIDES=(--parameter-overrides "DomainName=$DOMAIN_NAME" "CertificateArn=$CERT_ARN")
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "→ Installing dependencies"
npm ci --prefix "$ROOT"
npm ci --prefix "$ROOT/api"

echo "→ Building and deploying the stack ($STACK, $REGION)"
sam build --template-file "$ROOT/infra/template.yaml" --build-dir "$ROOT/.aws-sam/build"
sam deploy \
  --template-file "$ROOT/.aws-sam/build/template.yaml" \
  --stack-name "$STACK" \
  --region "$REGION" \
  --capabilities CAPABILITY_IAM \
  --resolve-s3 \
  --no-fail-on-empty-changeset \
  ${OVERRIDES[@]+"${OVERRIDES[@]}"}

output() {
  aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
}
BUCKET="$(output BucketName)"
DIST="$(output DistributionId)"

echo "→ Building the site"
npm run build --prefix "$ROOT"

echo "→ Uploading to s3://$BUCKET"
# Hashed assets can be cached forever; HTML must revalidate.
aws s3 sync "$ROOT/dist" "s3://$BUCKET" --delete --exclude "*.html" \
  --cache-control "public,max-age=31536000,immutable"
aws s3 sync "$ROOT/dist" "s3://$BUCKET" --delete --exclude "*" --include "*.html" \
  --cache-control "public,max-age=0,must-revalidate"

echo "→ Invalidating CloudFront"
aws cloudfront create-invalidation --distribution-id "$DIST" --paths "/*" >/dev/null

echo "✓ Live at $(output SiteUrl)"
if [[ -n "${DOMAIN_NAME:-}" ]]; then
  echo "  DNS: point a CNAME for $DOMAIN_NAME to $(output CloudFrontDomain)"
fi
