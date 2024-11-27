import React, { useContext, useEffect, useState}  from 'react'
import { AppContext } from '@/lib/AppVars';
import { useRouter } from 'next/router'
import DetailedView from '@/pages/Blogs/detailedView'
import { toast } from 'react-toastify'

interface reportsArray {
    id: number;
    reason: string;
    createdUserId: number;
    blogPostId: number;
}

function detailedBlog() {

    const context = useContext(AppContext);
    const router = useRouter();

    if (!context?.admin) {
        router.push('/');
    }

    const [reports, setReports] = useState<reportsArray[]>([]);
    const [reportCount, setReportCount] = useState(0);
    const [loadedAll, setLoadedAll] = useState(false);

    const blogId = router.query.id;
    const fetchAllReports = async (page: number) => {
        const data = await fetch(`/api/Admin/ReportedBlogs/GetReports?id=${blogId}&page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,   
    }    
        })
        const response = await data.json();
        if (!response || !response.reports) {
            return 
        }
        if (response.reports.length === 0) {
            setLoadedAll(true);
             return;
        }
        setReports([...reports, ...response.reports]);
     }

    useEffect(() => {
        if (router.isReady) {
            fetchAllReports(0);
        }
    }, [router.isReady]);


    const hideContent = async () => {
        const response = await fetch(`/api/Admin/HideContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                blogPostId: blogId})
        });

        if (!response.ok) {
            toast.error('Error hiding content!');
            return;
        }

        toast.success('Content hidden successfully!');

        setTimeout(() => {
            router.push('/Admin');
          }, 1500);
    }

  return (

    <div className="mb-8">
        {context?.admin === "True" ? 
        <div>
<div className="flex justify-center mt-8 mb-4">
  <button 
    onClick={hideContent} 
    className="px-4 py-2 rounded-md"
  >
    Hide Content
  </button>
</div>


            <DetailedView />
            <ul className="space-y-4">
                <div className="text-2xl font-semibold mb-2 text-center">Reports</div>
                {reports.map((report: reportsArray) => (
                    <li
                    key={report.id}
                    className="p-4 mx-48 border rounded-lg"
                    >
                    <p className="text-sm">
                        <span className="font-medium">Report ID:</span> {report.id}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Reason:</span> {report.reason}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Created By:</span> {report.createdUserId}
                    </p>
                    </li>
                ))}
</ul>

                {loadedAll ? <div className="flex justify-center my-4">Loaded all reports</div> :
                <div className="flex justify-center">
                    <button
                        onClick={() => { fetchAllReports(reportCount + 1); setReportCount(reportCount + 1) }}
                        className="px-4 py-2 mt-4 rounded-md border"
                    >
                        Load More
                    </button>
                </div>
                }
        </div> 

        : 
        
        <div>
            <h1 className="text-center text-4xl font-bold mt-12">
            You are not an admin
            </h1>
        </div>}

    </div>
  )
}

export default detailedBlog