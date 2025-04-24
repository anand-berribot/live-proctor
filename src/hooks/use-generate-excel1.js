// import React, { useCallback } from "react";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// export const useGenerateExcel = () => {

//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = `${d.getDate()}`.padStart(2, "0");
//     let month = `${d.getMonth() + 1}`.padStart(2, "0");
//     let year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const jobDescriptionList = async () => {
//     let list_of_description = [];
//     try {
//       const id = JSON.parse(localStorage.getItem('recruiter-user'))?.company_id;
//       const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get-job-description-title?company_id=${id}`, {
//         method: 'GET'
//       });

//       const result = await response.json();
//       if (result?.status === 'success') {
//         list_of_description = result.list_of_job_description_title;
//       }
//       return list_of_description;

//     } catch (error) {
//       console.log(error, 'error');
//       return list_of_description;
//     }
//   };

//   const generateExcel = useCallback(async () => {
//     try {
//       const list_of_job_description_title = await jobDescriptionList();
//       console.log('--list_of_job_description_title--', list_of_job_description_title);

//       const current_date = formatDate(new Date().toISOString().slice(0, 10));
//       const header = [
//         "Sr No",
//         "First Name",
//         "Last Name (optional)",
//         "Mobile Number",
//         "Email ID",
//         "Job Role",
//         "Schedule Start Date",
//         "Start Time",
//         "Schedule End Date",
//         "End Time"
//       ];
//       const rowData = [
//         "1",
//         "Joe",
//         "Doe",
//         "910000000000",
//         "joe.doe@example.com",
//         "Select Skill",
//         current_date,
//         "08:00:00",
//         current_date,
//         "23:59:00"
//       ];

//       // Create workbook and worksheet
//       let workbook = new ExcelJS.Workbook();
//       let worksheet = workbook.addWorksheet("ScheduleSheet");

//       // Add Header Row
//       let headerRow = worksheet.addRow(header);

//       // Style Header Row
//       headerRow.eachCell((cell, number) => {
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "4F81BD" }
//         };
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" }
//         };
//         cell.font = {
//           bold: true,
//           color: { argb: "FFFFFFFF" }
//         };
//         cell.alignment = {
//           vertical: "middle",
//           horizontal: "center"
//         };
//       });

//       // Set column widths
//       worksheet.columns = [
//         { header: "Sr No", width: 10 },
//         { header: "First Name", width: 20 },
//         { header: "Last Name (optional)", width: 25 },
//         { header: "Mobile Number", width: 30 },
//         { header: "Email ID", width: 35 },
//         { header: "Job Role", width: 45 },
//         { header: "Schedule Start Date", width: 20 },
//         { header: "Start Time", width: 15 },
//         { header: "Schedule End Date", width: 20 },
//         { header: "End Time", width: 15 }
//       ];

//       // Add a sample row of data
//       worksheet.addRow(rowData);

//       // Add data validation for Job Role column
//       worksheet.getCell("F2").dataValidation = {
//         type: "list",
//         allowBlank: true,
//         formulae: [`"${list_of_job_description_title.join(",")}"`]
//       };

//       // If using column indices:
//       worksheet.getColumn(1).eachCell({ includeEmpty: true }, function(cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       worksheet.getColumn(4).eachCell({ includeEmpty: true }, function(cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       // Generate Excel File
//       workbook.xlsx.writeBuffer().then((data) => {
//         let blob = new Blob([data], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         });
//         saveAs(blob, `${current_date}_schedule_sheet.xlsx`);
//       });
//     } catch (error) {
//       console.error("Error generating the schedule sheet", error);
//     }
//   }, []);


//   // const generateExcel = useCallback(async () => {
//   //   try {
//   //     const list_of_job_description_title = await jobDescriptionList();
//   //     console.log('--list_of_job_description_title--', list_of_job_description_title);

//   //     const current_date = formatDate(new Date().toISOString().slice(0, 10));
//   //     const header = [
//   //       "Sr No",
//   //       "First Name",
//   //       "Last Name (optional)",
//   //       "Mobile Number",
//   //       "Email ID",
//   //       "Job Role",
//   //       "Schedule Start Date",
//   //       "Start Time",
//   //       "Schedule End Date",
//   //       "End Time"
//   //     ];
//   //     const rowData = [
//   //       "1",
//   //       "Joe",
//   //       "Doe",
//   //       "910000000000",
//   //       "joe.doe@example.com",
//   //       "Select Skill",
//   //       current_date,
//   //       "08:00:00",
//   //       current_date,
//   //       "23:59:00"
//   //     ];

//   //     let workbook = new ExcelJS.Workbook();
//   //     let worksheet = workbook.addWorksheet("ScheduleSheet");
//   //     let listSheet = workbook.addWorksheet("JobRoles");

//   //     let headerRow = worksheet.addRow(header);
//   //     headerRow.eachCell((cell, number) => {
//   //       cell.fill = {
//   //         type: "pattern",
//   //         pattern: "solid",
//   //         fgColor: { argb: "4F81BD" }
//   //       };
//   //       cell.border = {
//   //         top: { style: "thin" },
//   //         left: { style: "thin" },
//   //         bottom: { style: "thin" },
//   //         right: { style: "thin" }
//   //       };
//   //       cell.font = {
//   //         bold: true,
//   //         color: { argb: "FFFFFFFF" }
//   //       };
//   //       cell.alignment = {
//   //         vertical: "middle",
//   //         horizontal: "center"
//   //       };
//   //     });

//   //     worksheet.columns = [
//   //       { header: "Sr No", width: 10 },
//   //       { header: "First Name", width: 20 },
//   //       { header: "Last Name (optional)", width: 25 },
//   //       { header: "Mobile Number", width: 30 },
//   //       { header: "Email ID", width: 35 },
//   //       { header: "Job Role", width: 45 },
//   //       { header: "Schedule Start Date", width: 20 },
//   //       { header: "Start Time", width: 15 },
//   //       { header: "Schedule End Date", width: 20 },
//   //       { header: "End Time", width: 15 }
//   //     ];

//   //     worksheet.addRow(rowData);

//   //     // Add job roles to the JobRoles sheet
//   //     listSheet.addRows(list_of_job_description_title.map(title => [title]));

//   //     // Create a named range for job roles
//   //     workbook.definedNames.add('JobRolesList', `JobRoles!$A$1:$A$${list_of_job_description_title.length}`);

//   //     // Apply data validation using the named range
//   //     worksheet.getCell("F2").dataValidation = {
//   //       type: "list",
//   //       allowBlank: true,
//   //       formula1: `JobRolesList`
//   //     };

//   //     worksheet.getColumn(1).eachCell({ includeEmpty: true }, function(cell) {
//   //       cell.numFmt = '0';  // No decimals, format as integer
//   //     });

//   //     worksheet.getColumn(4).eachCell({ includeEmpty: true }, function(cell) {
//   //       cell.numFmt = '0';  // No decimals, format as integer
//   //     });

//   //     workbook.xlsx.writeBuffer().then((data) => {
//   //       let blob = new Blob([data], {
//   //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//   //       });
//   //       saveAs(blob, `${current_date}_schedule_sheet.xlsx`);
//   //     });
//   //   } catch (error) {
//   //     console.error("Error generating the schedule sheet", error);
//   //   }
//   // }, []);



//   return { generateExcel };
// };



// ===================================================================================== 111111
// import React, { useCallback } from "react";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// export const useGenerateExcel = () => {
//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = `${d.getDate()}`.padStart(2, "0");
//     let month = `${d.getMonth() + 1}`.padStart(2, "0");
//     let year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const jobDescriptionList = async () => {
//     let list_of_description = [];
//     try {
//       const company_id = JSON.parse(localStorage.getItem('recruiter-user'))?.company_id; 
//       const user_id = JSON.parse(localStorage.getItem('recruiter-user'))?.user_id;
//       const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get-job-description-title?company_id=${company_id}&user_id=${user_id}`, {
//         method: 'GET'
//       });

//       const result = await response.json();
//       if (result?.status === 'success') {
//         list_of_description = result.list_of_job_description_title;
//       }
//       return list_of_description;

//     } catch (error) {
//       console.log(error, 'error');
//       return list_of_description;
//     }
//   };

//   const generateExcel = useCallback(async () => {
//     try {
//       const list_of_job_description_title = await jobDescriptionList();
//       const current_date = formatDate(new Date().toISOString().slice(0, 10));
//       const header = [
//         "Sr No",
//         "First Name",
//         "Last Name (optional)",
//         "Mobile Number",
//         "Email ID",
//         "Recruiter CC",
//         "Job Role",
//         "Schedule Start Date",
//         "Start Time",
//         "Schedule End Date",
//         "End Time"
//       ];
//       const rowData = [
//         "1",
//         "Joe",
//         "Doe",
//         "910000000000",
//         "joe.doe@example.com",
//         "cc1@example.com",
//         "Select Skill",
//         current_date,
//         "08:00:00",
//         current_date,
//         "23:59:00"
//       ];

//       // Create workbook and worksheets
//       let workbook = new ExcelJS.Workbook();
//       let worksheet = workbook.addWorksheet("ScheduleSheet");
//       let listSheet = workbook.addWorksheet("JobRoles");

//       // Add Header Row to ScheduleSheet
//       let headerRow = worksheet.addRow(header);
//       headerRow.eachCell((cell) => {
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "4F81BD" }
//         };
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" }
//         };
//         cell.font = {
//           bold: true,
//           color: { argb: "FFFFFFFF" }
//         };
//         cell.alignment = {
//           vertical: "middle",
//           horizontal: "center"
//         };
//       });

//       // Set column widths
//       worksheet.columns = [
//         { header: "Sr No", width: 10 },
//         { header: "First Name", width: 20 },
//         { header: "Last Name (optional)", width: 25 },
//         { header: "Mobile Number", width: 30 },
//         { header: "Email ID", width: 35 },
//         { header: "Recruiter Email ID", width: 35 },
//         { header: "Job Role", width: 45 },
//         { header: "Schedule Start Date", width: 20 },
//         { header: "Start Time", width: 15 },
//         { header: "Schedule End Date", width: 20 },
//         { header: "End Time", width: 15 }
//       ];

//       worksheet.addRow(rowData);


//       const validationList = `"${list_of_job_description_title.join(",")}"`

//       const dataValidation = {
//         type: "list",
//         allowBlank: true,
//         formulae: [validationList]
//       };
//       for (let row = 2; row <= 100; row++) {
//         worksheet.getCell(`G${row}`).dataValidation = dataValidation;
//       }

//       // // Add data validation for Job Role column
//       // worksheet.getCell("G2").dataValidation = {
//       //   type: "list",
//       //   allowBlank: true,
//       //   formulae: [`"${list_of_job_description_title.join(",")}"`]
//       // };

//       // If using column indices:
//       worksheet.getColumn(1).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       worksheet.getColumn(4).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       // Generate Excel File
//       workbook.xlsx.writeBuffer().then((data) => {
//         let blob = new Blob([data], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         });
//         saveAs(blob, `${current_date}_schedule_sheet.xlsx`);
//       });
//     } catch (error) {
//       console.error("Error generating the schedule sheet", error);
//     }
//   }, []);

//   return { generateExcel };
// };


// ===========================================================================22
// import React, { useCallback } from "react";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// export const useGenerateExcel = () => {
//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = `${d.getDate()}`.padStart(2, "0");
//     let month = `${d.getMonth() + 1}`.padStart(2, "0");
//     let year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const jobDescriptionList = async () => {
//     let list_of_description = [];
//     try {
//       const company_id = JSON.parse(localStorage.getItem('recruiter-user'))?.company_id; 
//       const user_id = JSON.parse(localStorage.getItem('recruiter-user'))?.user_id;
//       const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get-job-description-title?company_id=${company_id}&user_id=${user_id}`, {
//         method: 'GET'
//       });

//       const result = await response.json();
//       if (result?.status === 'success') {
//         list_of_description = result.list_of_job_description_title;
//       }
//       return list_of_description;

//     } catch (error) {
//       console.log(error, 'error');
//       return list_of_description;
//     }
//   };

//   const generateExcel = useCallback(async () => {
//     try {
//       const list_of_job_description_title = await jobDescriptionList();
//       const current_date = formatDate(new Date().toISOString().slice(0, 10));
//       const header = [
//         "Sr No",
//         "First Name",
//         "Last Name (optional)",
//         "Mobile Number",
//         "Email ID",
//         "Recruiter CC",
//         "Job Role",
//         "Schedule Start Date",
//         "Start Time",
//         "Schedule End Date",
//         "End Time"
//       ];
//       const rowData = [
//         "1",
//         "Joe",
//         "Doe",
//         "910000000000",
//         "joe.doe@example.com",
//         "cc1@example.com",
//         "Select Skill",
//         current_date,
//         "08:00:00",
//         current_date,
//         "23:59:00"
//       ];

//       // Create workbook and worksheets
//       let workbook = new ExcelJS.Workbook();
//       let worksheet = workbook.addWorksheet("ScheduleSheet");
//       let listSheet = workbook.addWorksheet("JobRoles");

//       // Write list of job descriptions to the JobRoles sheet

//       let list_of_job_description_title1 = [
//         "Python Developer Lead (BERRIBOT-JD-0043)",
//         "PLSQL Developer (BERRIBOT-JD-61)",
//         "Python Developer Lead (BERRIBOT-JD-0043)",
//         "PLSQL Developer (BERRIBOT-JD-61)",
//         "Python Developer Lead (BERRIBOT-JD-0043)",
//         "PLSQL Developer (BERRIBOT-JD-61)",
//         "Python Developer Lead (BERRIBOT-JD-0043)",
//         "PLSQL Developer (BERRIBOT-JD-61)",
//         "Java FSD Lead (BERRIBOT-JD-72)",
//         "Java Full Stack Lead Band B2 (BERRIBOT-JD-0019)"
//     ];
//       list_of_job_description_title.forEach((value, index) => {
//         listSheet.getCell(`A${index + 1}`).value = value;
//       });

//       // Hide the JobRoles sheet
//       listSheet.state = 'hidden';

//       // Add Header Row to ScheduleSheet
//       let headerRow = worksheet.addRow(header);
//       headerRow.eachCell((cell) => {
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "4F81BD" }
//         };
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" }
//         };
//         cell.font = {
//           bold: true,
//           color: { argb: "FFFFFFFF" }
//         };
//         cell.alignment = {
//           vertical: "middle",
//           horizontal: "center"
//         };
//       });

//       // Set column widths
//       worksheet.columns = [
//         { header: "Sr No", width: 10 },
//         { header: "First Name", width: 20 },
//         { header: "Last Name (optional)", width: 25 },
//         { header: "Mobile Number", width: 30 },
//         { header: "Email ID", width: 35 },
//         { header: "Recruiter Email ID", width: 35 },
//         { header: "Job Role", width: 45 },
//         { header: "Schedule Start Date", width: 20 },
//         { header: "Start Time", width: 15 },
//         { header: "Schedule End Date", width: 20 },
//         { header: "End Time", width: 15 }
//       ];

//       worksheet.addRow(rowData);

//       // Define range for job roles in the dropdown
//       const lastRow = list_of_job_description_title.length;
//       const dataValidation = {
//         type: "list",
//         allowBlank: true,
//         formula1: `JobRoles!$A$1:$A$${lastRow}`
//       };
//       for (let row = 2; row <= 100; row++) {
//         worksheet.getCell(`G${row}`).dataValidation = dataValidation;
//       }

//       // Set number format for certain columns
//       worksheet.getColumn(1).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       worksheet.getColumn(4).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       // Generate Excel File
//       workbook.xlsx.writeBuffer().then((data) => {
//         let blob = new Blob([data], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         });
//         saveAs(blob, `${current_date}_schedule_sheet.xlsx`);
//       });
//     } catch (error) {
//       console.error("Error generating the schedule sheet", error);
//     }
//   }, []);

//   return { generateExcel };
// };

//=================================================33333333333333333333333333333333

// import React, { useCallback } from "react";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// export const useGenerateExcel = () => {
//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = `${d.getDate()}`.padStart(2, "0");
//     let month = `${d.getMonth() + 1}`.padStart(2, "0");
//     let year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const jobDescriptionList = async () => {
//     let list_of_description = [];
//     try {
//       const company_id = JSON.parse(localStorage.getItem('recruiter-user'))?.company_id; 
//       const user_id = JSON.parse(localStorage.getItem('recruiter-user'))?.user_id;
//       const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get-job-description-title?company_id=${company_id}&user_id=${user_id}`, {
//         method: 'GET'
//       });

//       const result = await response.json();
//       if (result?.status === 'success') {
//         list_of_description = result.list_of_job_description_title;
//       }
//       return list_of_description;

//     } catch (error) {
//       console.log(error, 'error');
//       return list_of_description;
//     }
//   };

//   const generateExcel = useCallback(async () => {
//     try {
//       const list_of_job_description_title = await jobDescriptionList();
//       const current_date = formatDate(new Date().toISOString().slice(0, 10));
//       const header = [
//         "Sr No",
//         "First Name",
//         "Last Name (optional)",
//         "Mobile Number",
//         "Email ID",
//         "Recruiter CC",
//         "Job Role",
//         "Schedule Start Date",
//         "Start Time",
//         "Schedule End Date",
//         "End Time"
//       ];
//       const rowData = [
//         "1",
//         "Joe",
//         "Doe",
//         "910000000000",
//         "joe.doe@example.com",
//         "cc1@example.com",
//         "Select Skill",
//         current_date,
//         "08:00:00",
//         current_date,
//         "23:59:00"
//       ];

//       // Create workbook and worksheets
//       let workbook = new ExcelJS.Workbook();
//       let worksheet = workbook.addWorksheet("ScheduleSheet");
//       let listSheet = workbook.addWorksheet("JobRoles");

//       // Write list of job descriptions to the JobRoles sheet
//       list_of_job_description_title.forEach((value, index) => {
//         listSheet.getCell(`A${index + 1}`).value = value;
//       });

//       // Hide the JobRoles sheet
//       listSheet.state = 'hidden';

//       // Add Header Row to ScheduleSheet
//       let headerRow = worksheet.addRow(header);
//       headerRow.eachCell((cell) => {
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "4F81BD" }
//         };
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" }
//         };
//         cell.font = {
//           bold: true,
//           color: { argb: "FFFFFFFF" }
//         };
//         cell.alignment = {
//           vertical: "middle",
//           horizontal: "center"
//         };
//       });

//       // Set column widths
//       worksheet.columns = [
//         { header: "Sr No", width: 10 },
//         { header: "First Name", width: 20 },
//         { header: "Last Name (optional)", width: 25 },
//         { header: "Mobile Number", width: 30 },
//         { header: "Email ID", width: 35 },
//         { header: "Recruiter Email ID", width: 35 },
//         { header: "Job Role", width: 45 },
//         { header: "Schedule Start Date", width: 20 },
//         { header: "Start Time", width: 15 },
//         { header: "Schedule End Date", width: 20 },
//         { header: "End Time", width: 15 }
//       ];

//       worksheet.addRow(rowData);

//       // Define range for job roles in the dropdown
//       const lastRow = list_of_job_description_title.length;
//       const dataValidation = {
//         type: "list",
//         allowBlank: true,
//         formula1: `JobRoles!$A$1:$A$${lastRow}`
//       };
//       for (let row = 2; row <= 100; row++) {
//         worksheet.getCell(`G${row}`).dataValidation = dataValidation;
//       }

//       // Set number format for certain columns
//       worksheet.getColumn(1).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       worksheet.getColumn(4).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       // Generate Excel File
//       workbook.xlsx.writeBuffer().then((data) => {
//         let blob = new Blob([data], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         });
//         saveAs(blob, `${current_date}_schedule_sheet.xlsx`);
//       });
//     } catch (error) {
//       console.error("Error generating the schedule sheet", error);
//     }
//   }, []);

//   return { generateExcel };
// };

//=============================================================4444444444444444444444  hidden

// import React, { useCallback } from "react";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// export const useGenerateExcel = () => {
//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = `${d.getDate()}`.padStart(2, "0");
//     let month = `${d.getMonth() + 1}`.padStart(2, "0");
//     let year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const jobDescriptionList = async () => {
//     let list_of_description = [];
//     try {
//       const company_id = JSON.parse(localStorage.getItem('recruiter-user'))?.company_id; 
//       const user_id = JSON.parse(localStorage.getItem('recruiter-user'))?.user_id;
//       const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get-job-description-title?company_id=${company_id}&user_id=${user_id}`, {
//         method: 'GET'
//       });

//       const result = await response.json();
//       if (result?.status === 'success') {
//         list_of_description = result.list_of_job_description_title;
//       }
//       return list_of_description;

//     } catch (error) {
//       console.log(error, 'error');
//       return list_of_description;
//     }
//   };

//   const generateExcel = useCallback(async () => {
//     try {
//       const list_of_job_description_title = await jobDescriptionList();
//       const current_date = formatDate(new Date().toISOString().slice(0, 10));
//       const header = [
//         "Sr No",
//         "First Name",
//         "Last Name (optional)",
//         "Mobile Number",
//         "Email ID",
//         "Recruiter CC",
//         "Job Role",
//         "Schedule Start Date",
//         "Start Time",
//         "Schedule End Date",
//         "End Time"
//       ];
//       const rowData = [
//         "1",
//         "Joe",
//         "Doe",
//         "910000000000",
//         "joe.doe@example.com",
//         "cc1@example.com",
//         "Select Skill",
//         current_date,
//         "08:00:00",
//         current_date,
//         "23:59:00"
//       ];

//       // Create workbook and worksheets
//       let workbook = new ExcelJS.Workbook();
//       let worksheet = workbook.addWorksheet("ScheduleSheet");
//       let listSheet = workbook.addWorksheet("JobRoles");

//       // Write list of job descriptions to the JobRoles sheet
//       list_of_job_description_title.forEach((value, index) => {
//         listSheet.getCell(`A${index + 1}`).value = value;
//       });

//       // Hide the JobRoles sheet
//       listSheet.state = 'hidden';

//       // Add Header Row to ScheduleSheet
//       let headerRow = worksheet.addRow(header);
//       headerRow.eachCell((cell) => {
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "4F81BD" }
//         };
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" }
//         };
//         cell.font = {
//           bold: true,
//           color: { argb: "FFFFFFFF" }
//         };
//         cell.alignment = {
//           vertical: "middle",
//           horizontal: "center"
//         };
//       });

//       // Set column widths
//       worksheet.columns = [
//         { header: "Sr No", width: 10 },
//         { header: "First Name", width: 20 },
//         { header: "Last Name (optional)", width: 25 },
//         { header: "Mobile Number", width: 30 },
//         { header: "Email ID", width: 35 },
//         { header: "Recruiter Email ID", width: 35 },
//         { header: "Job Role", width: 45 },
//         { header: "Schedule Start Date", width: 20 },
//         { header: "Start Time", width: 15 },
//         { header: "Schedule End Date", width: 20 },
//         { header: "End Time", width: 15 }
//       ];

//       worksheet.addRow(rowData);

//       // Define range for job roles in the dropdown
//       const lastRow = list_of_job_description_title.length;
//       const dropdownRange = `JobRoles!$A$1:$A$${lastRow}`;

//       // Apply dropdown data validation in the "Job Role" column (G2 to G100)
//       for (let row = 2; row <= 100; row++) {
//         worksheet.getCell(`G${row}`).dataValidation = {
//           type: "list",
//           formula1: dropdownRange,
//           showDropDown: true,
//           errorTitle: "Invalid Job Role",
//           error: "Please select a valid job role from the dropdown.",
//           showErrorMessage: true,
//         };
//       }

//       // Set number format for certain columns
//       worksheet.getColumn(1).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       worksheet.getColumn(4).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       // Generate Excel File
//       workbook.xlsx.writeBuffer().then((data) => {
//         let blob = new Blob([data], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         });
//         saveAs(blob, `${current_date}_schedule_sheet.xlsx`);
//       });
//     } catch (error) {
//       console.error("Error generating the schedule sheet", error);
//     }
//   }, []);

//   return { generateExcel };
// };

// ===============================================5555555555 without hidden

// import React, { useCallback } from "react";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// export const useGenerateExcel = () => {
//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = `${d.getDate()}`.padStart(2, "0");
//     let month = `${d.getMonth() + 1}`.padStart(2, "0");
//     let year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const jobDescriptionList = async () => {
//     let list_of_description = [];
//     try {
//       const company_id = JSON.parse(localStorage.getItem('recruiter-user'))?.company_id; 
//       const user_id = JSON.parse(localStorage.getItem('recruiter-user'))?.user_id;
//       const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get-job-description-title?company_id=${company_id}&user_id=${user_id}`, {
//         method: 'GET'
//       });

//       const result = await response.json();
//       if (result?.status === 'success') {
//         list_of_description = result.list_of_job_description_title;
//       }
//       return list_of_description;

//     } catch (error) {
//       console.log(error, 'error');
//       return list_of_description;
//     }
//   };

//   const generateExcel = useCallback(async () => {
//     try {
//       const list_of_job_description_title = await jobDescriptionList();
//       const current_date = formatDate(new Date().toISOString().slice(0, 10));
//       const header = [
//         "Sr No",
//         "First Name",
//         "Last Name (optional)",
//         "Mobile Number",
//         "Email ID",
//         "Recruiter CC",
//         "Job Role",
//         "Schedule Start Date",
//         "Start Time",
//         "Schedule End Date",
//         "End Time"
//       ];
//       const rowData = [
//         "1",
//         "Joe",
//         "Doe",
//         "910000000000",
//         "joe.doe@example.com",
//         "cc1@example.com",
//         "Select Skill",
//         current_date,
//         "08:00:00",
//         current_date,
//         "23:59:00"
//       ];

//       // Create workbook and worksheets
//       let workbook = new ExcelJS.Workbook();
//       let worksheet = workbook.addWorksheet("ScheduleSheet");
//       let listSheet = workbook.addWorksheet("JobRoles");

//       // Write list of job descriptions to the JobRoles sheet
//       list_of_job_description_title.forEach((value, index) => {
//         listSheet.getCell(`A${index + 1}`).value = value;
//       });

//       // Ensure the JobRoles sheet is visible
//       listSheet.state = 'visible';

//       // Add Header Row to ScheduleSheet
//       let headerRow = worksheet.addRow(header);
//       headerRow.eachCell((cell) => {
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "4F81BD" }
//         };
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" }
//         };
//         cell.font = {
//           bold: true,
//           color: { argb: "FFFFFFFF" }
//         };
//         cell.alignment = {
//           vertical: "middle",
//           horizontal: "center"
//         };
//       });

//       // Set column widths
//       worksheet.columns = [
//         { header: "Sr No", width: 10 },
//         { header: "First Name", width: 20 },
//         { header: "Last Name (optional)", width: 25 },
//         { header: "Mobile Number", width: 30 },
//         { header: "Email ID", width: 35 },
//         { header: "Recruiter Email ID", width: 35 },
//         { header: "Job Role", width: 45 },
//         { header: "Schedule Start Date", width: 20 },
//         { header: "Start Time", width: 15 },
//         { header: "Schedule End Date", width: 20 },
//         { header: "End Time", width: 15 }
//       ];

//       worksheet.addRow(rowData);

//       // Define range for job roles in the dropdown
//       const lastRow = list_of_job_description_title.length;
//       const dropdownRange = `JobRoles!$A$1:$A$${lastRow}`;

//       // Apply dropdown data validation in the "Job Role" column (G2 to G100)
//       for (let row = 2; row <= 100; row++) {
//         worksheet.getCell(`G${row}`).dataValidation = {
//           type: "list",
//           formula1: dropdownRange,
//           showDropDown: true,
//           errorTitle: "Invalid Job Role",
//           error: "Please select a valid job role from the dropdown.",
//           showErrorMessage: true,
//         };
//       }

//       // Set number format for certain columns
//       worksheet.getColumn(1).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       worksheet.getColumn(4).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       // Generate Excel File
//       workbook.xlsx.writeBuffer().then((data) => {
//         let blob = new Blob([data], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         });
//         saveAs(blob, `${current_date}_schedule_sheet.xlsx`);
//       });
//     } catch (error) {
//       console.error("Error generating the schedule sheet", error);
//     }
//   }, []);

//   return { generateExcel };
// };

// =====================================6666 last try

// import React, { useCallback } from "react";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

// export const useGenerateExcel = () => {
//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = `${d.getDate()}`.padStart(2, "0");
//     let month = `${d.getMonth() + 1}`.padStart(2, "0");
//     let year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const jobDescriptionList = async () => {
//     let list_of_description = [];
//     try {
//       const company_id = JSON.parse(localStorage.getItem('recruiter-user'))?.company_id; 
//       const user_id = JSON.parse(localStorage.getItem('recruiter-user'))?.user_id;
//       const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get-job-description-title?company_id=${company_id}&user_id=${user_id}`, {
//         method: 'GET'
//       });

//       const result = await response.json();
//       if (result?.status === 'success') {
//         list_of_description = result.list_of_job_description_title;
//       }
//       return list_of_description;

//     } catch (error) {
//       console.log(error, 'error');
//       return list_of_description;
//     }
//   };

//   const generateExcel = useCallback(async () => {
//     try {
//       const list_of_job_description_title = await jobDescriptionList();
//       const current_date = formatDate(new Date().toISOString().slice(0, 10));
//       const header = [
//         "Sr No",
//         "First Name",
//         "Last Name (optional)",
//         "Mobile Number",
//         "Email ID",
//         "Recruiter Email ID",
//         "Job Role",
//         "Schedule Start Date",
//         "Start Time",
//         "Schedule End Date",
//         "End Time"
//       ];
//       const rowData = [
//         "1",
//         "Joe",
//         "Doe",
//         "910000000000",
//         "joe.doe@example.com",
//         "cc1@example.com",
//         "Select Skill",
//         current_date,
//         "08:00:00",
//         current_date,
//         "23:59:00"
//       ];

//       // Create workbook and worksheets
//       let workbook = new ExcelJS.Workbook();
//       let worksheet = workbook.addWorksheet("ScheduleSheet");
//       let listSheet = workbook.addWorksheet("JobRoles");

//       // Write list of job descriptions to the JobRoles sheet
//       list_of_job_description_title.forEach((value, index) => {
//         listSheet.getCell(`A${index + 1}`).value = value;
//       });

//       // Ensure the JobRoles sheet is visible
//       listSheet.state = 'visible';

//       // Add Header Row to ScheduleSheet
//       let headerRow = worksheet.addRow(header);
//       headerRow.eachCell((cell) => {
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "4F81BD" }
//         };
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" }
//         };
//         cell.font = {
//           bold: true,
//           color: { argb: "FFFFFFFF" }
//         };
//         cell.alignment = {
//           vertical: "middle",
//           horizontal: "center"
//         };
//       });

//       // Set column widths
//       worksheet.columns = [
//         { header: "Sr No", width: 10 },
//         { header: "First Name", width: 20 },
//         { header: "Last Name (optional)", width: 25 },
//         { header: "Mobile Number", width: 30 },
//         { header: "Email ID", width: 35 },
//         { header: "Recruiter Email ID", width: 35 },
//         { header: "Job Role", width: 45 },
//         { header: "Schedule Start Date", width: 20 },
//         { header: "Start Time", width: 15 },
//         { header: "Schedule End Date", width: 20 },
//         { header: "End Time", width: 15 }
//       ];

//       worksheet.addRow(rowData);

//       // Define range for job roles in the dropdown
//       const lastRow = list_of_job_description_title.length;
//       const dropdownRange = `JobRoles!$A$1:$A$${lastRow}`;

//       // Apply dropdown data validation in the "Job Role" column (G2 to G100)
//       for (let row = 2; row <= 100; row++) {
//         worksheet.getCell(`G${row}`).dataValidation = {
//           type: "list",
//           formula1: dropdownRange,
//           showDropDown: true,
//           errorTitle: "Invalid Job Role",
//           error: "Please select a valid job role from the dropdown.",
//           showErrorMessage: true,
//         };
//       }

//       // Set number format for certain columns
//       worksheet.getColumn(1).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       worksheet.getColumn(4).eachCell({ includeEmpty: true }, function (cell) {
//         cell.numFmt = '0';  // No decimals, format as integer
//       });

//       // Generate Excel File
//       workbook.xlsx.writeBuffer().then((data) => {
//         let blob = new Blob([data], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         });
//         saveAs(blob, `${current_date}_schedule_sheet.xlsx`);
//       });
//     } catch (error) {
//       console.error("Error generating the schedule sheet", error);
//     }
//   }, []);

//   return { generateExcel };
// };

// =========================================== with xlsx
// import React, { useCallback } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// export const useGenerateExcel = () => {
//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = `${d.getDate()}`.padStart(2, "0");
//     let month = `${d.getMonth() + 1}`.padStart(2, "0");
//     let year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const jobDescriptionList = async () => {
//     let list_of_description = [];
//     try {
//       const company_id = JSON.parse(localStorage.getItem('recruiter-user'))?.company_id; 
//       const user_id = JSON.parse(localStorage.getItem('recruiter-user'))?.user_id;
//       const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get-job-description-title?company_id=${company_id}&user_id=${user_id}`, {
//         method: 'GET'
//       });

//       const result = await response.json();
//       if (result?.status === 'success') {
//         list_of_description = result.list_of_job_description_title;
//       }
//       return list_of_description;

//     } catch (error) {
//       console.log(error, 'error');
//       return list_of_description;
//     }
//   };

//   const generateExcel = useCallback(async () => {
//     try {
//       const list_of_job_description_title = await jobDescriptionList();
//       const current_date = formatDate(new Date().toISOString().slice(0, 10));
//       const header = [
//         "Sr No",
//         "First Name",
//         "Last Name (optional)",
//         "Mobile Number",
//         "Email ID",
//         "Recruiter Email ID",
//         "Job Role",
//         "Schedule Start Date",
//         "Start Time",
//         "Schedule End Date",
//         "End Time"
//       ];
//       const rowData = [
//         "1",
//         "Joe",
//         "Doe",
//         "910000000000",
//         "joe.doe@example.com",
//         "cc1@example.com",
//         "Select Skill",
//         current_date,
//         "08:00:00",
//         current_date,
//         "23:59:00"
//       ];

//       // Create a new workbook and worksheet
//       const wb = XLSX.utils.book_new();

//       // Create ScheduleSheet with header and row data
//       const ws_data = [header, rowData];
//       const ws = XLSX.utils.aoa_to_sheet(ws_data);

//       // Set column widths
//       ws["!cols"] = [
//         { wch: 10 },
//         { wch: 20 },
//         { wch: 25 },
//         { wch: 30 },
//         { wch: 35 },
//         { wch: 35 },
//         { wch: 45 },
//         { wch: 20 },
//         { wch: 15 },
//         { wch: 20 },
//         { wch: 15 }
//       ];

//       // Add dropdown data validation
//       const jobRolesRange = list_of_job_description_title.map((_, index) => `JobRoles!$A$${index + 1}`).join(",");
//       for (let row = 2; row <= 100; row++) {
//         ws[`G${row}`] = { v: "Select Skill", t: "s" };
//         ws[`!dataValidation`] = [
//           {
//             sqref: `G${row}`,
//             type: "list",
//             formula1: `=${jobRolesRange}`,
//             showErrorMessage: true,
//             errorTitle: "Invalid Job Role",
//             error: "Please select a valid job role from the dropdown."
//           }
//         ];
//       }

//       // Create JobRoles sheet
//       const ws_job_roles = XLSX.utils.aoa_to_sheet(list_of_job_description_title.map(role => [role]));
//       XLSX.utils.book_append_sheet(wb, ws_job_roles, "JobRoles");

//       // Append ScheduleSheet to workbook
//       XLSX.utils.book_append_sheet(wb, ws, "ScheduleSheet");

//       // Write to file
//       const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//       saveAs(new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${current_date}_schedule_sheet.xlsx`);
//     } catch (error) {
//       console.error("Error generating the schedule sheet", error);
//     }
//   }, []);

//   return { generateExcel };
// };

