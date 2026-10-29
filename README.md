# Casaguapo

A private technology and lifestyle concierge for the world's most beautiful, wealthy and self-assured people. Casaguapo is a work of satire: the copy is absurd, and the presentation is entirely serious.

## What's here

| Path | What it is |
| --- | --- |
| `src/` | The website, built with [Astro](https://astro.build) as a static site |
| `src/styles/tokens.css` | The design system tokens (Amber accent from `#E69B00`, warm neutrals, Manrope and Inter, spacing, radii, elevation, motion) |
| `src/pages/system.astro` | The brand standards page at `/system/`, which renders every token and component |
| `src/components/Concierge.astro` | The AI Concierge: a chat panel, plus remarks on whatever the visitor clicks, ticks or types |
| `api/` | The Concierge's AWS Lambda function, which calls Claude (`claude-sonnet-5-5`) |
| `infra/` | AWS SAM template and deploy script: S3 + CloudFront for the site, API Gateway + Lambda for `/api/concierge` |

Pages: `/` (home), `/services/`, `/membership/`, `/apply/` (a four-step application that ends with a letter from the Committee), `/system/` and a 404.

## Local development

```sh
npm install
npm run dev        # http://localhost:4321
```

Locally there is no API, so the Concierge falls back to a small set of built-in remarks. To point the site at a deployed API, set `PUBLIC_CONCIERGE_URL` (for example `https://xxxx.cloudfront.net/api/concierge`) before `npm run dev`.

API tests and type checks:

```sh
cd api
npm install
npm test
npm run typecheck
```

## The Concierge

`POST /api/concierge` takes one of three modes:

- `chat`: `{ mode: "chat", messages: [{ role, content }] }`, for the chat panel.
- `remark`: `{ mode: "remark", action, page, previous }`, sent when the visitor interacts with the page (buttons, links, FAQ items, radio buttons, checkboxes, selects, text fields). Returns a one-sentence remark.
- `verdict`: `{ mode: "verdict", application }`, sent when the application form is submitted. Returns the Committee's letter.

The voice and its boundaries live in `api/src/prompts.ts`. It mocks the visitor's presumed lack of wealth only, never their appearance or identity, and drops the act if someone describes real hardship.

Once per visit, Jasmin starts talking 2 seconds after the visitor first scrolls and adds a line every 10 seconds (up to 50, each written fresh by Claude, with pre-written lines as a fallback) until the visitor clicks her. She answers 50 chat messages per visitor. Clicking one of her remarks opens the chat with that remark as her opening line. The 50th reply is a rude goodbye, after which the chat shows “Jasmin left the chat” and stays closed for 24 hours (remembered in the browser's localStorage). The Lambda enforces the same limit and stops calling Claude for any later message (`MAX_CHAT_REPLIES` in `api/src/validate.ts`).

Spend guardrails: the browser waits 4 seconds between remarks and stops asking for remarks after 60 per session; the Lambda caps message length and history; API Gateway throttles to 5 requests a second (burst 10) across all visitors; replies use low effort and short outputs. Adjust `ApiRateLimit` and `ApiBurstLimit` in `infra/template.yaml` if needed.

## Deploying to AWS

Prerequisites: AWS CLI v2, [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html), Node 22, and credentials for the target account.

1. Store your Anthropic API key in SSM Parameter Store once. It never goes into the repo or the Lambda's environment.

   ```sh
   aws ssm put-parameter --name /casaguapo/anthropic-api-key --type SecureString --value "sk-ant-..."
   ```

2. Deploy:

   ```sh
   ./infra/deploy.sh                       # defaults: stack "casaguapo", region us-east-1
   STACK_NAME=casaguapo AWS_REGION=eu-west-2 ./infra/deploy.sh
   ```

   The script builds and deploys the stack, builds the site, uploads it to the bucket and invalidates CloudFront. It prints the site URL when it's done.

### Custom domain

1. Request a certificate in `us-east-1` (CloudFront only uses certificates from that region), validated by DNS:

   ```sh
   aws acm request-certificate --region us-east-1 --domain-name www.example.com --validation-method DNS
   aws acm describe-certificate --region us-east-1 --certificate-arn <arn> \
     --query "Certificate.DomainValidationOptions[0].ResourceRecord"
   ```

   Add the CNAME it prints at your DNS provider and wait until the certificate's status is `ISSUED`.

2. Deploy with the domain. Always pass both variables, or a later deploy will remove the domain:

   ```sh
   DOMAIN_NAME=www.example.com CERT_ARN=<arn> ./infra/deploy.sh
   ```

3. Point a CNAME for `www` at the `CloudFrontDomain` the script prints. Providers such as GoDaddy can't put a CNAME on the bare domain, so forward `example.com` to `https://www.example.com` instead.

### Bare domain with Route 53

To serve both `example.com` and `www.example.com`, host the domain's DNS in Route 53. Create a hosted zone, copy over any existing records (mail especially), point the registrar's nameservers at it, then deploy with:

```sh
DOMAIN_NAME=example.com HOSTED_ZONE_ID=Z0123456789 ./infra/deploy.sh
```

The stack then issues the certificate and creates the alias records itself. Deploy in `us-east-1`.

## Automatic deploys

`.github/workflows/deploy.yml` runs the API tests and `infra/deploy.sh` on every push to `main` (including merged pull requests), and can be run by hand from the Actions tab. It signs in to AWS through GitHub's OIDC, so no AWS keys are stored in GitHub.

One-time setup:

1. Create the deploy role. If this AWS account already has a GitHub OIDC provider, add `--parameter-overrides CreateOidcProvider=false`.

   ```sh
   aws cloudformation deploy --stack-name casaguapo-github --template-file infra/github-deploy-role.yaml \
     --capabilities CAPABILITY_NAMED_IAM --region us-east-1
   aws cloudformation describe-stacks --stack-name casaguapo-github --region us-east-1 \
     --query "Stacks[0].Outputs[0].OutputValue" --output text
   ```

2. In GitHub, under Settings → Secrets and variables → Actions → Variables, add `AWS_DEPLOY_ROLE_ARN` (the ARN printed above), plus `DOMAIN_NAME` and `CERT_ARN` if the site uses a custom domain. These are not secrets.

## Images

Editorial photography is loaded from Unsplash. Each image sits on a toned backdrop, so a photo that fails to load leaves a tasteful gradient rather than a broken image. To self-host, put files in `public/images/` and update `src/data/site.ts`.
