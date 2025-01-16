
// const HOST = "/MYSIGN/";
// var paymenturl = "/PAYMENTSIMULATOR/getunitscalltesting";

const { UpdateRounded } = require("@material-ui/icons");

// const HOST = "https://uat.docuexec.com/MYSIGN/";
// var paymenturl = "https://uat.docuexec.com/PAYMENTSIMULATOR/getunitscalltesting";

const HOST = "http://localhost:7090/MYSIGN/";
var paymenturl = "http://localhost:7095/PAYMENTSIMULATOR/getunitscalltesting";


// const HOST = "http://10.10.40.50:8090/MYSIGN/";
// var paymenturl = "http://10.10.40.50:8095/PAYMENTSIMULATOR/getunitscalltesting";

const footerContent =

  "Copyright ©️ 2024 Integra Micro Systems Private Ltd. All Rights Reserved. Version : 1.9.30";


// const rupeeIcon = '\&#x20B9';
const rupeeSymbol = '\u20B9';

let URL = {
  appName: "DocuExec",//
  register: HOST + "userRegister",//
  regValidateOtp: HOST + "regValidateOtp",//
  login: HOST + "V2/loginValidate",
  getOtp: HOST + "V2/getOtp",
  getFlags: HOST + "V2/getFlags",
  getTermsAndConditions: HOST + "getTermsAndConditions",
  getTermsAndConditionsV2: HOST + "V2/getTermsAndConditions",
  getSignedDoc: HOST + "getSignedDoc",
  getSignedDocV2: HOST + "V2/getSignedDoc",
  download: HOST + "download",//Unused
  getWalletInfo: HOST + "V2/getWalletDetails",
  getUnitsHistory: HOST + "V2/getUnitsHistory",
  getPaymentHistory: HOST + "V2/getPaymentHistory",
  getProfileDetails: HOST + "V2/getProfileDetails",
  changePassword: HOST + "V2/changePassword",
  editProfile: HOST + "V2/editProfile",
  getOtpForgotPassword: HOST + "getOtpForgotPassword",
  forgotPassword: HOST + "forgotPassword",
  getQR: HOST + "V2/getQR",
  getPaymentStatus: HOST + "V2/getPaymentStatus",
  logOut: HOST + "V2/logOut",
  getRequiredUnits: HOST + "V2/getRequiredUnits",
  getServices: HOST + "V2/getServices",
  updateServices: HOST + "V2/updateServices",
  getPaymentReports: HOST + "V2/getPaymentReports",
  geteSignReports: HOST + "V2/geteSignReports",
  getUsersReports: HOST + "V2/getUsersReports",
  consenteSign: HOST + "V2/consenteSign",
  getSummaryPDF: HOST + "V2/getSummaryPDF",//////
  mpsGetGuestAccess: HOST + "mpsGetGuestAccess",
  mpsCreateJobsV2: HOST + "mpsCreateJobsV2",
  getInboxDocDetails: HOST + "V2/getInboxDocDetails",
  downloadStoredFile: HOST + "inbox/downloadFile",//////
  downloadStoredFileV2: HOST + "inbox/V2/downloadFile",//////
  deleteStoredFile: HOST + "inbox/V2/deleteFile",
  cancelSigningJob: HOST + "inbox/V2/cancelJob",
  selfTokenSign: HOST + "V2/selfTokenSign",//////
  viewStoredFile: HOST + "inbox/viewFile",//////
  viewStoredFileV2: HOST + "inbox/V2/viewFile",//////
  downloadClientProgram: HOST + "V2/downloadClientProgram",//
  generateOTP: HOST + "V2/generateOTP",
  resendEsignOtp: HOST + "V2/resendEsignOtp",
  generatedscaccesscode: HOST + "generatedscaccesscodeV2",//
  unlockdscdocument: HOST + "unlockdscdocument",//
  getSubscriptionLists: HOST + "getSubscriptionLists",
  subscribedPlanDetails: HOST + "subscribedPlanDetails",
  subscribedPlanDetailsV2: HOST + "V2/subscribedPlanDetails",
  checkinQueuePlan: HOST + "V2/checkSubscriptionDetails",
  viewConsentFile: HOST + "V2/viewConsentFile",
  sendReminder: HOST + "inbox/V2/sendReminder",
  paymenturl: paymenturl,
  getOtpforVerification: HOST + "getOtpforVerification",//
  footerContent: footerContent,
  getOtpforEditProfileVerftn: HOST + "V2/getOtpforEditProfileVerftn",
  viewSignedFile: HOST + "V2/viewSignedFile",
  getstoredFilefrmTempDetails: HOST + "V2/getstoredFilefrmTempDetails",
  downloadfromtemp: HOST + "V2/downloadfromtemp",
  digiLocker: HOST + "digilocker/makedigilockercall",//
  KYCDetails: HOST + "V2/getUserAadharDetails",
  BulkRegistration: HOST + "V2/bulkRegistration",///////
  generateOtpforMobAccess: HOST + "generateOtpforMobAccess",/////
  withdrawMoney: HOST + "withdrawMoney",
  getBankDetails: HOST + "getBankDetails",
  downloadSignCmpltd: HOST + "downloadSignCmpltd",//
  DeleteUser: HOST + "V2/deleteUserAccount",//////
  getEmailTemplateValidation: HOST + "V2/getEmailTemplateValidation",
  sendEmail: HOST + "V2/emailDocument",
  getCaptchaCode: HOST + "getCaptchaCode",
  mpsGetGuestAccess1: HOST + "mpsGetGuestAccessV2",
  mpsGetGuestAccessV2: HOST + "V2/mpsGetGuestAccess",
  getSignerComments: HOST + "V2/getSignerComments",
  getrevenueReports: HOST + "V2/getrevenueReports",
  getSignCoordinateDetails: HOST + "V2/getSignCoordinateDetails",
  getTemplateList: HOST + "V2/getTemplateList",
  generatePDFfromTemplate: HOST + "V2/generatePDFfromTemplate",
  getTemplateInputs: HOST + "V2/getTemplateInputs",
  addHtmlTempAndFormDetail: HOST + "V2/insertIntoTempmasterp",
  getTemplateToBeApproved: HOST + "V2/getTemToBeApproved",
  insertHtmlTempAndFormDetails: HOST + "V2/insertHtmlTempAndFormDetails",
  // getGroupFormTempGroup: HOST + "getGroupFormTempGroup",
  getTemplateApplnList: HOST + "V2/getTemplateApplnList",
  updateTemplate: HOST + "V2/updateTemplate",
  getTemplateListForAdmin: HOST + "V2/gettemplatelistforadmin",
  saveTemplateDrafts: HOST + "V2/saveTemplateDrafts",
  getEachTempDraftDetails: HOST + "V2/getEachTempDraftDetails",
  getDraftTemplates: HOST + "V2/getDraftTemplates",
  deleteTempDraft: HOST + "V2/deleteTempDraft",
  dbsUAT: "https://ilpuat.finfotech.co.in/esc/test/dbs/ipayments",
  getTempForCsv: HOST + "V2/getTempDetForCsv",
  getTempDetForMultiCsv: HOST + "V2/getTempDetForMultiCsv",
  getTempsForThatGroupCode: HOST + "V2/getTempsForThatGroupCode",
  getValidationKeys: HOST + "V2/getValidationKeys",
  deleteRejectedTemp: HOST + "V2/deleteRejectedTemp",
  tempdataForEdit: HOST + "V2/tempdataForEditAndApprove",
  getTemplateGrps: HOST + "V2/getTemplateGrps",
  getAllTemplateGrps: HOST + "V2/getTemplateGrps",
  getUserDetails: HOST + "V2/getUserDetails",
  viewAddedTemplateUsers: HOST + "V2/viewTemplateUsers",
  addCorporateUsers: HOST + "V2/addCorporateUsers",
  addTemplateUsers: HOST + "V2/addTemplateUsers",
  removeTemplateUsers: HOST + "V2/removeTemplateUsers",
  getCorpDetailsReg: HOST + "getCorpDetails",
  getCorpDetails: HOST + "V2/getCorpDetails",
  modifygrpAdmin: HOST + "V2/modifygrpAdmin",
  createTemplateGrp: HOST + "V2/createTemplateGrp",
  getVoucherCodes: HOST + "V2/getVoucherCodes",
  getVoucherInfo: HOST + "V2/getVoucherInfo",
  getVoucherUsageDetails: HOST + "V2/getVoucherUsageDetails",
  getVoucherSummary: HOST + "V2/getVoucherSummary",
  subscribeVoucher: HOST + "V2/subscribeVoucher",
  rupeeSymbol: rupeeSymbol,
  getCustomFields: HOST + "V2/getCustomFields",
  updateCustomFields: HOST + "V2/updateCustomFields",
  // corpListAndSubGrp: HOST + "corpListAndSubGrp",
  getCorpMemberRequests: HOST + "V2/getCorpMemberRequests",////////
  approveCorpMemberRequests: HOST + "V2/approveCorpMemberRequests",//////
  addCorpMember: HOST + "V2/addCorpMember",
  checkVoucherCodeAvailability: HOST + "V2/checkUsrDefinedVchrCode",////////
  declineSigning: HOST + "V2/declineSigning",////
  fetchAddressBook: HOST + "V2/fetchAddressBook",
  insertToAddressBook: HOST + "V2/insertToAddressBook",
  removeFromAddressBook: HOST + "V2/removeFromAddressBook",
  modifyAddressBook: HOST + "V2/modifyAddressBook",
  uploadDocument: HOST + "V2/uploadDocument",
  fetchDesignationBonus: HOST + "V2/getDesignationBonus",
  insertDesignationBonus: HOST + "V2/createDesignationBonus",
  UpdateDesignationBonus: HOST + "V2/updateDesignationBonus",
  upddateDesignationStatus: HOST + "V2/updateDesignationBonus/status",
  uploadEmployees: HOST + "V2/uploadEmployees",
  getCorpEmpMappingList: HOST + "V2/getCorpEmpMappingList",
  getCorpEmployee: HOST + "V2/getCorpEmployee",
  updateCorpEmpMapping: HOST + "V2/updateCorpEmpMapping",
  deleteUserFromCorpGroup: HOST + "V2/deleteUserFromCorpGroup",
  createCorporateEntity: HOST + "V2/createCorporateEntity",
  generateapikey: HOST + "V2/generateapikey",
  getApikeys: HOST + "V2/getApikeys",
  bulkRegistrationInfo: HOST + "V2/bulkRegistrationInfo",
  updateapikey: HOST + "V2/updateapikey",
  enableDisableCorpEntity: HOST + "V2/enableDisableCorpEntity",
  downloadInvoice: HOST + "V2/downloadInvoice",
  getFeedbackQuestions: HOST + "V2/getFeedbackQuestions",
  insertUsersFeedback: HOST + "V2/insertUsersFeedback",
  getUsersFeedback: HOST + "V2/getUsersFeedback",
  getOAuthEndPointURL: HOST + "V2/getOAuthEndPointURL",
  fetchAccessToken: HOST + "fetchAccessToken",
  getKey: HOST + "getkey",
  uploadBulkSignFile: HOST + "V2/uploadBulkSignFile",///
  getbulkSigningdetails: HOST + "V2/getbulkSigningdetails",
  uploadBulkSigndetails: HOST + "V2/uploadBulkSigndetails",
  inAPPAPI: HOST + "INAPP/mpsCreateJobsV2",
  getApplicationKeys: HOST + "V2/getApplicationKeys",
  fetchInputFieldsData: HOST + "V2/fetchInputFieldsData",
  registerUser: "/register",
  exportSignerStatusReport: HOST + "V2/exportSignerStatusReport",
};

module.exports = { URL };
