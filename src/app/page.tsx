export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center px-4 bg-black text-gray-200">
      {/* Hero */}
      <section className="w-full py-10 text-center bg-gradient-to-b from-neutral-900 to-black">
        <h1 className="text-5xl font-bold text-white mb-4">
          Give Everyone a Voice
        </h1>
        <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
          Collect anonymous, honest feedback easily with Yap. No barriers, no awkwardness — just insights.
        </p>
        <a
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-7xl w-full mx-auto px-4 py-10 text-center"
      >
        <h2 className="text-3xl font-bold mb-12 text-white">Why Choose Yap?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-neutral-900 shadow-sm p-6 rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Anonymous by Default
            </h3>
            <p className="text-gray-400">
              Encourage honesty with fully anonymous feedback forms.
            </p>
          </div>
          <div className="bg-neutral-900 shadow-sm p-6 rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Shareable Links
            </h3>
            <p className="text-gray-400">
              Send a link to anyone — start collecting responses instantly.
            </p>
          </div>
          <div className="bg-neutral-900 shadow-sm p-6 rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Distraction-Free
            </h3>
            <p className="text-gray-400">
              Clean, minimal experience for you and your respondents.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="bg-neutral-950 w-full py-10 text-center px-4"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">
            About Yap
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Yap was built to make feedback easy. Whether you are collecting suggestions from employees, students, or customers — Yap gives everyone a voice without the awkwardness.
          </p>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-800 py-6 w-full mt-12 text-sm text-gray-500 text-center">
        © 2025 Yap. All rights reserved. &nbsp;·&nbsp;
        <a href="#" className="hover:text-blue-400">Privacy</a> ·{" "}
        <a href="#" className="hover:text-blue-400">Terms</a>
      </footer>
    </main>
  );
}