export const PatientRoleId = "011101";
export const StaffRoleId = "011112";
export const ClinicalRoleId = "011113";
export const CommercialRoleId = "011114";
export const FinancialRoleId = "011115";
export const AssociateRoleId = "011116";
export const GodminRoleId = "011100";

export const AccessLevelToRoleId: Record<
  "Staff" | "Clinical" | "Financial" | "Commercial" | "Associate",
  string
> = {
  Staff: StaffRoleId,
  Clinical: ClinicalRoleId,
  Financial: FinancialRoleId,
  Commercial: CommercialRoleId,
  Associate: AssociateRoleId,
};
