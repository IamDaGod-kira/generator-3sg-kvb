import { lazy, Suspense } from "react";
import Swal from "sweetalert2";

const Login = lazy(() =>
  import("./login").catch((err) => {
    Swal.fire({
      icon: "error",
      title: "Failed to load login form",
      text: "Please try refreshing the page.",
      confirmButtonColor: "#2563eb",
    });
    console.error("Error loading Login component:", err);
    throw err;
  }),
);
//test comment
export default function Home() {
  return (
    <main className="max-w-6xl mx-auto my-10 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left Side: About + Achievements */}
        <div className="w-full lg:w-2/3 p-6 sm:p-8">
          <section className="mb-10">
            <h2 className="text-2xl text-blue-900 font-semibold mb-4">
              About Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PM SHRI Kendriya Vidyalaya Ballygunge is one of the premier and
              leading academic institutions of West Bengal. It came into
              existence in 1980 starting its day from the cabins of Nishan Hut.
              The Vidyalaya today stands with all its pride and beauty in the
              lush green sprawling fields of Maidan Camp with a beautiful
              3-storeyed rectangular building, comprising of big classrooms,
              well-equipped laboratories, convention hall, ATL Lab, Language
              Lab, CMP Hall, and three computer labs with all modern equipment.
              The beautiful garden, the children's park, and two big playgrounds
              are its added facilities.
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              The Kendriya Vidyalayas have a four-fold mission, viz.:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 leading-relaxed space-y-1">
              <li>
                To cater to the educational needs of children of transferable
                Central Government employees including Defense and Para-military
                personnel by providing a common programme of education.
              </li>
              <li>
                To pursue excellence and set the pace in the field of school
                education.
              </li>
              <li>
                To initiate and promote experimentation and innovations in
                education in collaboration with other bodies like the CBSE and
                NCERT.
              </li>
              <li>
                To develop the spirit of national integration and create a sense
                of Indianness among children.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl text-blue-900 font-semibold mb-4">
              Achievements
            </h2>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-1">
              <li>
                100% Board Exam Results in Class X & XII for the past 5 years.
              </li>
              <li>Winners of the Regional Science Exhibition 2024.</li>
              <li>Excellence in sports at regional and national level.</li>
              <li>
                Students selected for National Talent Search Examination (NTSE).
              </li>
            </ul>
          </section>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/3 p-6 sm:p-8 bg-gradient-to-r from-[#ebe045]/20 to-[#33cfff]/20 flex items-center justify-center">
          <Suspense
            fallback={
              <div className="text-center text-gray-500 animate-pulse">
                Loading form...
              </div>
            }
          >
            <Login />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
