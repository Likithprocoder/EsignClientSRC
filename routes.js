import React from "react";

const DocUpload = React.lazy(() => import("./containers/Upload/DocUpload"));
const Preview = React.lazy(() => import("./containers/Upload/Preview"));
const ESign = React.lazy(() => import("./containers/Upload/ESign"));
const Documents = React.lazy(() => import("./containers/Reports/DocDetails"));
const TxnDetails = React.lazy(() => import("./containers/Reports/TxnDetails"));
const Wallet = React.lazy(() => import("./containers/Wallet/Wallet"));
const RateCard = React.lazy(() => import("./containers/Rate_Card/RateCard"));
const Payment = React.lazy(() => import("./containers/Payment/Payment"));
const Recharge = React.lazy(() => import("./containers/Upload/Recharge"));
const PaymentDetails = React.lazy(() =>
  import("./containers/Reports/PaymentDetails")
);
const ProfileDetails = React.lazy(() =>
  import("./containers/Profile/ProfileDetails")
);
const QRCode = React.lazy(() => import("./containers/Payment/QRcode"));
const EditProfile = React.lazy(() =>
  import("./containers/Profile/EditProfile")
);
const UpdateServices = React.lazy(() =>
  import("./containers/Services/UpdateServices")
);
const PaymentReports = React.lazy(() =>
  import("./containers/AdminReports/PaymentReports")
);
const eSignReports = React.lazy(() =>
  import("./containers/AdminReports/eSignReports")
);
const UsersReports = React.lazy(() =>
  import("./containers/AdminReports/UsersReport")
);
const TokenSignDownload = React.lazy(() =>
  import("./containers/Download/TokenSignDownload")
);
const SignerInfo = React.lazy(() =>
  import("./containers/MultiPplSign/SignerInfo")
);
const MultiPplSignPreview = React.lazy(() =>
  import("./containers/MultiPplSign/MultiPplSignPreview")
);
const Inbox = React.lazy(() => import("./containers/Inbox/Inbox"));
const Subscription = React.lazy(() =>
  import("./containers/Subscription/Subscription")
);
const QRDetails = React.lazy(() => import("./containers/Payment/QRDetails"));
const Download = React.lazy(() => import("./containers/Download/Download"));
const KYCStatus = React.lazy(() => import("./containers/DigiLocker/KYCStatus"));

const BulkRegistration = React.lazy(() =>
  import("./containers/AdminReports/BulkRegistration")
);
const AccountDelete = React.lazy(() =>
  import("./containers/AdminReports/AccountDelete")
);
const RevenueReport = React.lazy(() =>
  import("./containers/AdminReports/RevenueReport")
);

const DefaultTemplate = React.lazy(() => import("./containers/Templates/DefaultTemplates"))
const Template = React.lazy(() => import("./containers/Templates/Template"))
const DisplayPdf = React.lazy(() => import("./containers/Templates/Template Pdf Preview"))
const HtmlUpload1 = React.lazy(() => import("./containers/AdminUploadTemplate/HtmlUpload"))
const Htmlinput = React.lazy(() => import("./containers/AdminUploadTemplate/HtmlInput"))
const TempDetPreview = React.lazy(() => import("./containers/AdminUploadTemplate/TempFieldPreview"))
const GetTemToApproved = React.lazy(() => import("./containers/AdminTemplateApproval/ApproveTemp"))
const viewTemplate = React.lazy(() => import("./containers/AdminTemplateApproval/ViewTemplate"))
const ApplicationInbox = React.lazy(() => import("./containers/Inbox/ApplicationInbox"))
const getTemplistToAdmin = React.lazy(() => import("./containers/AdminTemplateApproval/TemplateList"));
const GetTemDraft = React.lazy(() => import("./containers/Templates/TempDraftData"));
const UploadedTemplate = React.lazy(() => import("./containers/AdminUploadTemplate/UploadedTemplates"));
const addOrViewTempGroup = React.lazy(() => import("./containers/AccessControl/TempGroupAddOrView"));
const addEndUsrToTempGrp = React.lazy(() => import("./containers/AccessControl/AddEndUsrToTempGrp"));
const viewTempGroupUsers = React.lazy(() => import("./containers/AccessControl/ViewTempGroupUsers"));
const createTempGroup = React.lazy(() => import("./containers/AccessControl/CreateTempGroup"))
// const Test = React.lazy(() => import('./containers/Test/test'))
const VoucherUsageInfo = React.lazy(() => import("./containers/Voucher/VoucherDetial"));
const getVoucherSummary = React.lazy(() => import("./containers/Voucher/VoucherSummary"));
const VoucherSubscription = React.lazy(() => import("./containers/Voucher/VoucherSubscription"));
const ReqcorpUsrs = React.lazy(() => import("./containers/AccessControl/ReqUsrForCorp"));
const extFrmCorp = React.lazy(() => import("./containers/Profile/ExitFromCorporate"));
// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/docUpload", name: "Sign Document", component: DocUpload },
  { path: "/preview", name: "Preview", component: Preview },
  { path: "/esign", name: "ESign", component: ESign },
  { path: "/accountInfo", name: "Account Details", component: Wallet },
  { path: "/docDetails", name: "Documents", component: Documents },
  { path: "/rateCard", name: "Rate Card", component: RateCard },
  {
    path: "/reports/txnDetails",
    name: "Transaction Details",
    component: TxnDetails,
  },
  { path: "/payments/esignTopup", name: "eSign TopUp", component: Payment },

  { path: "/recharge", name: "Recharge", component: Recharge },
  {
    path: "/reports/paymentDetails",
    name: "Payment Details",
    component: PaymentDetails,
  },
  {
    path: "/profileDetails",
    name: "Profile Details",
    component: ProfileDetails,
  },
  { path: "/qrcode", name: "QR Code", component: QRCode },
  { path: "/editProfile", name: "Edit Profile", component: EditProfile },
  {
    path: "/serviceSettings",
    name: "Service Settings",
    component: UpdateServices,
  },
  {
    path: "/reports/paymentReports",
    name: "Payment Report",
    component: PaymentReports,
  },
  {
    path: "/reports/eSignReports",
    name: "eSign Report",
    component: eSignReports,
  },
  {
    path: "/reports/usersReports",
    name: "Users List",
    component: UsersReports,
  },
  {
    path: "/download/tokenSignDownload",
    name: "Download page",
    component: TokenSignDownload,
  },
  { path: "/signerInfo", name: "Signer Information", component: SignerInfo },
  {
    path: "/multiPplSignPreview",
    name: "Preview",
    component: MultiPplSignPreview,
  },
  { path: "/inbox", name: "Inbox", component: Inbox },
  {
    path: "/payments/subscriptions",
    name: "Subscription TopUp",
    component: Subscription,
  },
  { path: "/qrDetails", name: "QRDetails", component: QRDetails },

  // { path: "/download", name: "Download", component: Download },
  { path: "/KYCStatus", name: "KYC Status", component: KYCStatus },
  {
    path: "/BulkRegistration",
    name: "Bulk Registration",
    component: BulkRegistration,
  },
  {
    path: "/accountDelete",
    name: "Account Delete",
    component: AccountDelete,
  },

  {
    path: "/reports/revenueReport",
    name: "Revenue Report",
    component: RevenueReport,
  },
  {
    path: "/applications",
    name: "Applications Details",
    component: ApplicationInbox,
  },
  { path: "/templates", name: "Templates", component: DefaultTemplate },
  { path: "/template", name: "Template", component: Template },
  {
    path: "/templatePdfPreview",
    name: " Template Pdf Preview",
    component: DisplayPdf,
  },
  { path: "/uploadTemplate", name: " Upload Template", component: HtmlUpload1 },
  { path: "/templatePreview", name: "Template Preview", component: Htmlinput },
  {
    path: "/templateFieldPreview",
    name: "Template Field Preview",
    component: TempDetPreview,
  },
  {
    path: "/getTempToApprove",
    name: "Template Approval",
    component: GetTemToApproved,
  },
  { path: "/viewTemplate", name: "Template Details", component: viewTemplate },
  {
    path: "/templateList",
    name: "Template List",
    component: getTemplistToAdmin,
  },
  {
    path: "/draftForms",
    name: "Draft Templates",
    component: GetTemDraft,
  },
  {
    path: "/uploadedTemplates",
    name: "Uploaded Template",
    component: UploadedTemplate,
  },
  {
    path: "/addOrViewTempGroup",
    name: "Template Managment",
    component: addOrViewTempGroup,
  },
  {
    path: "/addEndUsrToTempGrp",
    name: "Add Template Users",
    component: addEndUsrToTempGrp,
  },
  {
    path: "/viewTempGrpUsr",
    name: "View Template Users",
    component: viewTempGroupUsers
  },
  {
    path: "/createTemptgroup",
    name: "Create Template Group",
    component: createTempGroup
  },
  {
    path: "/voucherUsageInfo",
    name: "Voucher Usage Info",
    component: VoucherUsageInfo
  },
  {
    path: "/vouchers/getVoucherSummary",
    name: "Voucher Summary",
    component: getVoucherSummary
  },
  {
    path: "/vouchers/vouchersubscription",
    name: "Voucher Subscription",
    component: VoucherSubscription
  },
  {
    path: "/requestedUsers",
    name: "Requested Corporate Users",
    component: ReqcorpUsrs
  },
  {
    path: "/exitFromCorporate",
    name: "Exit or unlink from the corporate entity",
    component: extFrmCorp
  }



];
export default routes;
