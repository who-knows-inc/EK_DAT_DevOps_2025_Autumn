variable "subscription_id" {
  description = "The azure subscription ID"
  type        = string
}

variable "vm_name" {
  description = "The name of the virtual machine"
  type        = string
  default     = "main-vm"
}
