# Host on Azure Container Apps, defined in Terraform

Status: proposed. Parts not yet reverified by the owner are listed in [reverify.md](../reverify.md).

Services run on Azure Container Apps, and every environment (dev, staging, production) is created from the same Terraform code. Azure Kubernetes Service (AKS) is not used. One person runs this system, so the platform has to need as little day-to-day operation as possible.

## Considered Options

- **AKS.** Rejected: it gives full Kubernetes control, but cluster upgrades, node pools and networking become ongoing work for one person, with no feature that v1 needs.
- **Bicep instead of Terraform.** Not chosen: the owner chose Terraform.

## Consequences

- Supporting services are Azure Blob Storage (media), Service Bus (the jobs queue and an order-events topic), PostgreSQL Flexible Server, Key Vault and Application Insights.
- Container Apps limits custom networking and node-level control. Anything that needs them is a reason to revisit this ADR.
- Revisit trigger (unverified, see [reverify.md](../reverify.md)): move to AKS only if a requirement cannot be met on Container Apps (custom networking, for example) or a second operator joins and can carry cluster work.
