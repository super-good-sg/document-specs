# Host on Azure Container Apps, defined in Bicep

Services run on Azure Container Apps, and every environment (dev, staging, production) is created from the same Bicep files. Azure Kubernetes Service (AKS) is not used. One person runs this system, so the platform has to need as little day-to-day operation as possible.

## Considered Options

- **AKS.** Rejected: it gives full Kubernetes control, but cluster upgrades, node pools and networking become ongoing work for one person, with no feature that v1 needs.
- **Terraform instead of Bicep.** Rejected: Terraform is cloud-neutral, but v1 targets Azure only, and Bicep needs no state file and supports new Azure features sooner.

## Consequences

- Supporting services are Azure Blob Storage (media), Service Bus (the jobs queue), PostgreSQL Flexible Server, Key Vault and Application Insights.
- Container Apps limits custom networking and node-level control. Anything that needs them is a reason to revisit this ADR.
- The Bicep files are Azure-specific, so moving to another cloud means rewriting them.
- Revisit trigger: move to AKS only if a requirement cannot be met on Container Apps (custom networking, for example) or a second operator joins and can carry cluster work.
