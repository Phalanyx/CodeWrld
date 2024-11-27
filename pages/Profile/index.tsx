import React, { useEffect, useContext, useState } from "react";
import { AppContext } from '@/lib/AppVars';
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ProfilePage = () => {

  const context = useContext(AppContext);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarFile, setAvatarFile] = useState<File>();

  const [newPword, setNewPword] = useState("");
  const [confirmPword, setConfirmPword] = useState("");

  const [avatarDisplay, setAvatarDisplay] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.push("/Login");
    }
    const fetchProfile = async () => {
      if (context?.userID) {
        const response = await fetch(`/api/Profile/${context.userID}`);
        if (!response.ok) {
          console.error("Failed to fetch profile data");
          return;
        }

        const data = await response.json();

        setAvatarDisplay(data.avatar);
        setUsername(data.userName);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
      }
    };

    fetchProfile();
  }, [context?.userID]);

  const savePasswordPrelightCheck = () => {
    if (!newPword) {
      return false;
    }
    if (newPword !== confirmPword) {
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    const response = await fetch("/api/Profile/Update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phoneNumber,
      }),
    });
    if (response.ok) {
      toast.success("Profile updated!");
    } else {
      toast.error(`Error updating profile!`);
    }
  };

  const handleUploadAvatar = async () => {
    if (avatarFile) {

      const formData = new FormData();
      formData.append("file", avatarFile, avatarFile.name);

      const response = await fetch("/api/Profile/Avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Avatar updated!");
        setTimeout(() => {
          router.reload();
        }, 1500);
      } 
      else {
        toast.error(`Error updating avatar`);
      }
    }
  };

  const handleSavePassword = async () => {
    if (!savePasswordPrelightCheck()) {
      toast.warning("Please ensure your passwords match and try again.");
      return;
    }

    const response = await fetch("/api/Profile/Update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ password: newPword }),
    });

    if (!response.ok) {
      toast.error("Error updating password");
      return;
    }

    toast.success("Password updated!");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto p-4 mb-4">
      {avatarDisplay && (
        <img
          src={`data:image/jpeg;base64,${avatarDisplay}`}
          alt={"avatar"}
          className="w-20 h-20 rounded-full m-auto mb-3"
        />
      )}
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <form onSubmit={
        (e) => {
          e.preventDefault();
          handleSaveChanges();
        }
      } className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input readOnly
            type="text"
            id="userName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none sm:text-sm"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input readOnly
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none sm:text-sm"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="firstName" className="block text-sm font-medium">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="phoneNumber" className="block text-sm font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" 
            placeholder="123-456-7890"
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="py-2 px-4 rounded-md shadow outline-none"
        >
          Save Changes
        </button>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); handleUploadAvatar()}} className="mt-10">
        <h2 className="text-1xl font-bold mb-4">Change Avatar</h2>

        <div className="mt-3">
          <label htmlFor="file" className="block text-sm font-medium">
            Upload New Avatar
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
          {avatarFile && <p>{avatarFile.name}</p>}
        </div>

        <button
          type="submit"
          className={`py-2 px-4 rounded-md shadow outline-none mt-3`}
        >
          Upload
        </button>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); handleSavePassword(); }} className="mt-10">
        <h2 className="text-1xl font-bold mb-4">Change Password</h2>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            value={newPword}
            onChange={(e) => setNewPword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPword}
            onChange={(e) => setConfirmPword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className={`py-2 px-4 rounded-md shadow outline-none mt-3`}
        >
          Save Password
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;