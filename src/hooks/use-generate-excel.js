import React, { useCallback } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const MASTERMIND_API_URL = process.env.VITE_REACT_APP_API_URL;
const PROCTOR_API_URL = process.env.VITE_REACT_APP_PROCTOR_API_URL;
const FRONTEND_LOGS = process.env.VITE_REACT_APP_FRONTEND_LOGS;

export const useGenerateExcel = () => {
    // Function to format the date as DD-MM-YYYY
    const formatDate = (date) => {
        const d = new Date(date);
        const day = `${d.getDate()}`.padStart(2, "0");
        const month = `${d.getMonth() + 1}`.padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Function to fetch job description list from the API
    const getCompanyConfiguration = async () => {
        try {
            const response = await fetch(`${PROCTOR_API_URL}mastermind/recruiter-view/get_company_configuration`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('recruiter-token')}`
                },
            });

            const result = await response.json();
            console.log("Company Configuration:", result);
            if (result?.status === 'success') {
                return result.data?.is_reference_id_required;
            }

            return false;

        } catch (error) {
            console.error(" Error fetching job descriptions:", error);
            return false;
        }
    };

    // Function to fetch job description list from the API
    const jobDescriptionList = async () => {
        let list_of_description = [];
        try {
            const company_id = JSON.parse(localStorage.getItem('recruiter-user'))?.company_id;
            const user_id = JSON.parse(localStorage.getItem('recruiter-user'))?.user_id;

            const response = await fetch(`${process.env.VITE_REACT_APP_API_URL}get-job-description-title?company_id=${company_id}&user_id=${user_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('recruiter-token')}`
                },
            });

            const result = await response.json();
            if (result?.status === 'success') {
                list_of_description = result.list_of_job_description_title;
            }
            return list_of_description;
        } catch (error) {
            console.error("Error fetching job descriptions:", error);
            return list_of_description;
        }
    };

    // Function to generate the Excel file
    const generateExcel = useCallback(async () => {
        try {
            // Fetch the list of job descriptions
            const list_of_job_description_title = await jobDescriptionList();
            const is_reference_id_required = await getCompanyConfiguration();

            // Get the current date formatted as DD-MM-YYYY
            const current_date = formatDate(new Date());

            // Define the header row
            const header = [
                "Sr No",
                "First Name",
                "Last Name (optional)",
                "Mobile Number",
                "Email ID",
                "Recruiter Email ID",
                "Candidate Id (optional)",
                "Job Role",
                "Schedule Start Date",
                "Start Time",
                "Schedule End Date",
                "End Time"
            ];

            // Define a sample row of data
            const rowData = [
                "1",
                "Joe",
                "Doe",
                "910000000000",
                "joe.doe@example.com",
                "cc1@example.com",
                "CAN-001",
                "Select Skill",
                current_date,
                "08:00:00",
                current_date,
                "23:59:00"
            ];

            // Create a new Excel workbook and add worksheets
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("ScheduleSheet");
            const listSheet = workbook.addWorksheet("JobroleValues");

            // Write job descriptions to the JobroleValues sheet
            list_of_job_description_title.forEach((value) => {
                listSheet.addRow([value]);
            });

            // Add header row to ScheduleSheet and style it
            const headerRow = worksheet.addRow(header);
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "4F81BD" }
                };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
                cell.font = {
                    bold: true,
                    color: { argb: "FFFFFFFF" }
                };
                cell.alignment = {
                    vertical: "middle",
                    horizontal: "center"
                };
            });

            // Set column widths for the ScheduleSheet
            worksheet.columns = [
                { header: "Sr No", width: 10 },
                { header: "First Name", width: 20 },
                { header: "Last Name (optional)", width: 25 },
                { header: "Mobile Number", width: 30 },
                { header: "Email ID", width: 35 },
                { header: "Recruiter Email ID", width: 35 },
                { header: `Candidate Id${is_reference_id_required ? '':' (optional)' }`, width: 30 },
                { header: "Job Role", width: 55 },
                { header: "Schedule Start Date", width: 20 },
                { header: "Start Time", width: 15 },
                { header: "Schedule End Date", width: 20 },
                { header: "End Time", width: 15 }
            ];

            // Add the sample row data to the worksheet
            worksheet.addRow(rowData);

            // Hide the JobroleValues sheet
            listSheet.state = 'veryHidden'; 

            // Apply data validation for the "Job Role" column
            worksheet.getCell(`H2`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: [`JobroleValues!$A$1:$A$${list_of_job_description_title.length}`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Error',
                error: 'Value must be from the list',
            };

            for (let row = 2; row <= 1001; row++) {
                worksheet.getCell(`H${row}`).dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: [`JobroleValues!$A$1:$A$${list_of_job_description_title.length}`],
                    showErrorMessage: true,
                    errorStyle: 'error',
                    errorTitle: 'Error',
                    error: 'Value must be from the list',
                };
            }

            // Generate Excel File with given name
            workbook.xlsx.writeBuffer().then(data => {
                const blob = new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                saveAs(blob, `${current_date}_schedule_sheet.xlsx`);
            });

        } catch (error) {
            console.error("Error generating the schedule sheet:", error);
        }
    }, []);

    return { generateExcel };
};
