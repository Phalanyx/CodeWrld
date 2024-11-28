import { useEffect, useState, useContext, use } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { AppContext } from "@/lib/AppVars";
import BackgroundGradient from "./components/BackgroundGradient";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  rating: number;
}

interface CodeTemplate {
  id: number;
  title: string;
  language: string;
  forkedFromID: number;
}

const HomePage = () => {

  const pageSize = 3;

  const [totalPages, setTotalPages] = useState(1);
  const [myBlogs, setBlogs] = useState<BlogPost[]>([]);
  const [myTemplates, setTemplates] = useState<CodeTemplate[]>([]);
  const [page, setPage] = useState(1);
  const [view, setView] = useState('');

  const router = useRouter();
  const context = useContext(AppContext);

  useEffect(() => {
    const query = { view };
    router.replace({ 
      pathname: router.pathname, 
      query 
    }, undefined, { shallow: true });
  }, [view]);

  useEffect(() => {
    if (router.isReady) {
      const view = String(router.query.view || "blogs");
      setView(view);
    }
  }, [router.isReady]);

  useEffect(() => {
    setTemplates([]);
    setBlogs([]);
    setPage(1);

    if (view === "blogs") {
      fetchPosts();
    } 
    else if (view === "templates") {
      fetchTemplates();
    }
  }, [view]);

  useEffect(() => {
    if (page === 0) {
      setTemplates([]);
      setBlogs([]);
      setPage(1);
    } 

    if (view === "blogs") {
      fetchPosts();
    } 
    else if (view === "templates") {
      fetchTemplates();
    }
  }, [page, context?.userID]);

  useEffect(() => {
    if (myBlogs.length > pageSize || myTemplates.length > pageSize) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [myBlogs, myTemplates]);

  const fetchPosts = async () => {

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      createdUserID: String(context?.userID),
    }).toString();

    const response = await fetch(`/api/BlogPosts?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')} || ''`,
      },
    });

    if (!response.ok) {
      setBlogs([]);
      setTotalPages(1);
      return;
    }

    const data = await response.json();
    setBlogs([...myBlogs, ...data.posts]);
    setTotalPages(data.totalPages);
  };

  const fetchTemplates = async () => {

    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      createdUserID: String(context?.userID),
    }).toString();

    const response = await fetch(`/api/CodeTemplates?${query}`);

    if (!response.ok) {
      setTemplates([]);
      setTotalPages(1);
      return;
    }

    const data = await response.json();
    setTemplates([...myTemplates, ...data.codeTemplates]);
    setTotalPages(data.totalPages);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen mb-6">

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="text-center mb-10"
      >
        <h1 className="mt-2 text-4xl font-extrabold drop-shadow-lg">
          Welcome to Scriptorium!
        </h1>

        <p className="mt-4 text-xl">
          A hub where programmers can execute code, share ideas, and learn from
          each other.
        </p>
      
      {context?.userID ? (
        <div className="flex justify-center space-x-12 mt-8 font-bold font-mono">
          <motion.button
            whileHover={{ scale: 1.05, transition: { duration: 0 } }}
            onClick={() => router.push("/Blogs/createBlog")}
            className="btn bg-blue-400 px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all"
          >
            Create Blog Post
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, transition: { duration: 0 } }}
            onClick={() => router.push("/Runner")}
            className="btn bg-orange-400 px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all"
          >
            Create Code Template
          </motion.button>
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-lg">
            <button onClick={() => router.push("/Login")} className="rounded-full px-4 py-2 font-semibold font-mono">Please Login First!</button>
          </p>
        </div>
      )}
      </motion.div>

      {context?.userID && <div>
        <div className="text-center">
          <select
            value={view}
            onChange={(e) => setView(e.target.value as "blogs" | "templates")}
            className="p-2 rounded shadow-md focus:outline-none"
          >
            <option value="blogs">My Blog Posts</option>
            <option value="templates">My Code Templates</option>
          </select>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {view === "blogs" &&
              myBlogs.map(blog => (
                <motion.div
                  className="cursor-pointer"
                  onClick={() => router.push(`/Blogs/detailedView?id=${blog.id}`)}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  key={blog.id}
                >
                  <BackgroundGradient className="p-4 shadow rounded-2xl bg-cta-background">
                    <h2 className="font-bold">{blog.title}</h2>
                    <p className="mt-2 text-sm">{blog.description}</p>
                    <p className="mt-2 text-sm">⭐ Rating: {blog.rating}</p>
                  </BackgroundGradient>
                </motion.div>
              ))}

            {view === "templates" &&
              myTemplates.map(template  => (
                <motion.div
                  className="cursor-pointer"
                  onClick={() => router.push(`/Templates/detailedView?id=${template.id}`)}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  key={template.id}
                >
                  <BackgroundGradient className="p-4 shadow rounded-2xl bg-cta-background">
                  <h2 className="font-bold">{template.title}</h2>
                  <p className="mt-2 text-sm">Language: {template.language}</p>
                  {template.forkedFromID && (
                    <p className="mt-2 text-sm">[ Forked Template ]</p>
                  )}
                  </BackgroundGradient>
                </motion.div>
              ))}
          </div>

          <div className="flex justify-center mt-8 space-x-8">
            <button
              onClick={() => handlePageChange(page + 1)}
              className="p-4 rounded-full bg-transparent text-gray-400 border-2 border-green-500"
            >
              Load More
            </button>

            <button
              onClick={() => handlePageChange(0)}
              className="p-4 rounded-full bg-transparent text-gray-400 border-2 border-red-500"
            >
              Collapse
            </button>
          </div>
        </div>
        </div>
      }
    </div>
  );
};

export default HomePage;