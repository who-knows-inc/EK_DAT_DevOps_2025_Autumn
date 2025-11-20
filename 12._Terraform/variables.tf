variable "subscription_id" {
  description = "The azure subscription ID"
  type        = string
}

variable "vm_name" {
  description = "The name of the virtual machine"
  type        = string
  default     = "main-vm"
}

variable "ssh_password" {
  description = "The password for the SSH user"
  type        = string
  sensitive   = true
}