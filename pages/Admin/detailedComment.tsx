import React, { useContext, useEffect, useState}  from 'react'
import { AppContext } from '@/lib/AppVars';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import DetailedView from '@/pages/Blogs/detailedView'



interface Comment {
    blogPostId: number;
    content: string;
    createdUserId: number;
    createdBy: {
      userName: string;
    };
    id: number;
    inappropriate: boolean;
    rating: number;
    repliedToId: number | null;
    reportCount: number;
}


interface reportsArray {
    id: number;
    reason: string;
    createdUserId: number;
    blogPostId: number;
}

function detailedComment() {

    const context = useContext(AppContext);
    const router = useRouter();
    const commentId = router.query.commentId;
    const [reports, setReports] = useState<reportsArray[]>([]);
    const [comment, setComment] = useState<Comment>({} as Comment);
    const [reportCount, setReportCount] = useState(0);
    const [loadedAll, setLoadedAll] = useState(false);
    const [blogPostId, setBlogPostId] = useState(0);

    useEffect(() => {
        if (router.isReady) {
            fetchComment(router.query.commentId ?? "0");
        }
    }, [router.isReady])

    const fetchComment = async (id: string | string[]) => {
        const data = await fetch(`/api/Comments?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const response = await data.json();
        setComment(response);

      }

    const fetchAllReports = async (page: number) => {
        const data = await fetch(`/api/Admin/ReportedComments/GetReports?id=${commentId}&page=${page}`, {
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


    const hideContent = async () => {
        const response = await fetch(`/api/Admin/HideContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                commentId: commentId})
        })

        if (!response.ok) {
            toast.error('Error hiding content!');
            return;
        }

        toast.success('Content hidden successfully!');  

        setTimeout(() => {
          router.push('/Admin');
        }, 1500);
    }

    useEffect(() => {
        if (router.isReady) {
        fetchAllReports(0);
        }
    }, [router.isReady])


  return (
    <div>
    {context?.admin === 'True' ? 
 <div className="flex flex-col items-center p-6 space-y-6 min-h-screen">
      <DetailedView/>

      <button
   onClick={hideContent}
   className="px-6 py-3 rounded-md border"
 >
   Hide Content
 </button> 
 <div className="w-full max-w-2xl space-y-6">
   <div className="space-y-4">
     <h2 className="text-xl font-bold text-center">Comment</h2>
     <div
       className="p-6 border rounded-lg">
       <p className="text-sm">
         <span className="font-medium">Comment ID:</span> {comment.id}
       </p>
       <p className="text-sm">
         <span className="font-medium">Content:</span> {comment.content}
       </p>
       <p className="text-sm">
         <span className="font-medium">Created By:</span> {comment.createdBy?.userName}
       </p>
     </div>
   </div>

   <div className="space-y-4">
     <h2 className="text-xl font-bold text-center">Reports</h2>
     <ul className="space-y-4">
       {reports.map((report: reportsArray) => (
         <div
           key={report.id}
           className="p-6 border rounded-lg"
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
         </div>
       ))}
     </ul>
   </div>
 </div>


 {loadedAll ? (
   <div className="flex justify-center my-4">Loaded all reports</div>
 ) : (
   <button
    className="px-4 py-2 rounded border"
     onClick={() => {
       fetchAllReports(reportCount + 1);
       setReportCount(reportCount + 1);
     }}
     >
     Load More
   </button>
 )}
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

export default detailedComment 