import { useForm } from "react-hook-form";
import FormInput from "./components/forms/FormInput";
import FormTextArea from "./components/forms/FormTextArea";
import FormSelect from "./components/forms/FormSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const formSchema = z.object({
  jobRole: z.string(),
  fullName: z.string().min(5).max(120),
  email: z.string().email(),
  address: z.string().min(10).max(120),
  qualification: z.string().min(10).max(120),
  comments: z.string().min(10).max(2000),
});

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [candidates, setCandidates] = useState([]);

  const COLLECTION_NAME = "candidates";

  const sendThisToServer = async (data) => {
    // EVERY VALIDATION SHOULD PASS!
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      console.log("Document written with ID: ", docRef.id);
      alert("Added as you said!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    reset();
  };

  useEffect(() => {
    // Fetch data from server
    async function getDataFromFirebase() {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

      setCandidates(querySnapshot.docs.map((doc) => doc.data()));
      // console.log(querySnapshot.docs[0].data());
      // querySnapshot.forEach((doc) => {
      //   console.log(`${doc.id} => ${doc.data()}`, doc.data());
      // });

      if (querySnapshot.docs.length === 0) {
        console.log("No record exist!");
      }
    }

    getDataFromFirebase();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <header className="bg-amber-500 px-10 py-5 text-center font-semibold">
        Interview Scheduled Candidates
      </header>
      <main className="container mx-auto my-5">
        <section className="bg-white p-5 rounded shadow">
          <h2 className="font-semibold text-lg">
            Interview Scheduled Candidates
          </h2>
          <form
            className="space-y-4 mt-5"
            onSubmit={handleSubmit(sendThisToServer)}
          >
            <FormSelect name="jobRole" register={register("jobRole")} />
            <FormInput
              name="fullName"
              placeholder="Full Name"
              register={register("fullName")}
              error={errors.fullName}
            />
            <FormInput
              name="email"
              placeholder="Email"
              register={register("email")}
              error={errors.email}
            />
            <FormTextArea
              name="address"
              placeholder="Address"
              register={register("address")}
              error={errors.address}
            />
            <FormTextArea
              name="qualification"
              placeholder="Qualification"
              register={register("qualification")}
              error={errors.qualification}
            />
            <FormTextArea
              name="comments"
              placeholder="comments"
              register={register("comments")}
              error={errors.comments}
            />
            <button className="px-4 p-2 rounded bg-green-500 hover:bg-green-600 text-white">
              Submit
            </button>
          </form>
        </section>

        {/* Display values */}
        <section className="my-10">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 w-20">
                    S. No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Full name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Job Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Qualification
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{candidate.fullName}</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {candidate.jobRole}
                    </th>
                    <td className="px-6 py-4">{candidate.email}</td>
                    <td className="px-6 py-4">{candidate.qualification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
