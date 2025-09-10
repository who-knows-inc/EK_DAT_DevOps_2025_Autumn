# Azure Available Regions

Figure out which regions you are allowed to deploy to.

**Motivation**: It seems like that available regions is severely limited on the `ek` domain (Azure For Students) and differ between accounts with no rhyme or reason. It is not possible to change the available regions.

**Deadline**: Before class

---

## The Azure Portal Method

1. Go to [this link](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Compliance) after being logged in to your Azure For Students account with your `ek` mail.

2. You will see a row representing policies for your Azure for Students account. Click on the three dots on the right and select **Edit Assignment**:

<img src="./assets_azure_available_regions/01._policy_compliance.png" alt="policy compliance azure for students">

3. Choose the **Parameters** tab and expand the dropdown. You will see the available regions.

<img src="./assets_azure_available_regions/02._assign_policy.png" alt="azure for students available regions">

**Note**: Your available regions will likely differ from the screenshot above.

---

## Scripting Method

### Prerequisites

1. Install `AZ CLI`:

https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest&pivots=winget

2. Log in with your browser to get the subscription id. In your terminal run:

```bash
$ az login
```

### The Script

This script tests what regions you are allowed to create VMs in. While you are allowed to create resource groups in **ALL** regions this does not translate to permission to actually create VMs in said region.

If you are on *nix you will have to make the script executable:

```bash
$ chmod +x <script_name>
```

And run it:

```bash
$ ./<script_name>
```

The script:

```bash
#!/bin/bash

echo "Testing regions with storage account creation..."
echo ""

# Create a test resource group first
az group create --name "policy-test-rg" --location "uksouth" --output none 2>/dev/null

for region in $(az account list-locations --query "[].name" --output tsv); do
    echo -n "$region... "
    
    storage_name="test$(date +%s)$RANDOM"
    
    if az storage account create \
        --name $storage_name \
        --resource-group "policy-test-rg" \
        --location $region \
        --sku Standard_LRS \
        --output none 2>/dev/null; then
        echo "✅ AVAILABLE"
        # Clean up
        az storage account delete --name $storage_name --resource-group "policy-test-rg" --yes --output none 2>/dev/null
    else
        echo "❌ BLOCKED"
    fi
done

# Clean up resource group
az group delete --name "policy-test-rg" --yes --no-wait --output none 2>/dev/null
```