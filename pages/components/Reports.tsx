import React, { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

interface ReportProps {
    blogPostId?: number
    commentId?: number
}
interface Report {
    reason: string
    blogPostId?: number
    commentId?: number
}

function Reports(props: ReportProps) {

    const createReport = async (report: Report) => {

        if (report.blogPostId){
            const data = await fetch(`/api/Report/Blog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(report),
            });
 
            if (!data.ok) {
                toast.error("Report failed to be created!");
                return;
            }

            toast.success("Report created successfully!");
        }

        else if (report.commentId){
            const data = await fetch(`/api/Report/Comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(report),
            });

            if (!data.ok) {
                toast.error("Report failed to be created!");
                return;
            }

            toast.success("Report created successfully!");
        }
    }

    const customToast = () => (
        <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-500">Note: Your report will be reviewed by a Scriptorium admin.</p>
            <p>Please enter report reason: </p>

            <input
                type="text"
                id="reasonInput"
                className="border rounded p-2 w-full"
                placeholder="Reason"
            />

            <button
                className="rounded"
                onClick={() => {
                    const reason = (document.getElementById('reasonInput') as HTMLInputElement).value;
                    if (reason.trim()) {
                        toast.dismiss();
                        createReport({ reason, blogPostId: props.blogPostId, commentId: props.commentId });
                    } 
                    else {
                        toast.warning('Reason cannot be empty!');
                    }
                }}
            >
                Submit
            </button>
        </div>
    );

    const handleReportClick = () => {
        toast(customToast);
    };

    return (
        <div>
            <button 
                onClick={handleReportClick}
                className="rounded-full px-2 py-1 border-none bg-transparent border text-gray-400 font-semibold text-xs cursor-pointer">
                Report
            </button>
        </div>
    )
}

export default Reports;