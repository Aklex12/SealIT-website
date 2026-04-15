const SUPABASE_URL = "https://ixnmzgtcfoqrkydqaybg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bm16Z3RjZm9xcmt5ZHFheWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzIzNDUsImV4cCI6MjA5MTg0ODM0NX0.wV-YWZ10iDttXSvc43kUpzA9xFPHgAl99PwHgKSkkqI";

const contactForm = document.getElementById("contact-form");
const formFeedback = document.getElementById("form-feedback");
const submitBtn = document.getElementById("contact-submit");
const defaultBtnLabel = submitBtn ? submitBtn.textContent.trim() : "";

if (contactForm && submitBtn && formFeedback && typeof supabase !== "undefined") {
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formFeedback.textContent = "";
    formFeedback.classList.remove("is-success", "is-error");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("project").value.trim();

    if (!name || !email || !message) {
      formFeedback.textContent = "Please fill in all fields.";
      formFeedback.classList.add("is-error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const { error } = await supabaseClient.from("contacts").insert({ name, email, message });

    if (error) {
      formFeedback.textContent =
        "Something went wrong. Please try again in a moment.";
      formFeedback.classList.add("is-error");
      submitBtn.disabled = false;
      submitBtn.textContent = defaultBtnLabel;
      return;
    }

    formFeedback.textContent =
      "Thank you! We'll get back to you within 24 hours.";
    formFeedback.classList.add("is-success");
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = defaultBtnLabel;
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const value = btn.dataset.filter;
    projects.forEach((project) => {
      const cats = project.dataset.category.split(" ");
      const show = value === "all" || cats.includes(value);
      project.style.display = show ? "block" : "none";
    });
  });
});

const testimonials = [
  {
    quote: "\"AxonStudio transformed our old marketing site into a conversion engine. We saw uplift in signups within the first week of launch.\"",
    name: "Sarah Mitchell",
    title: "VP Marketing, Luminary",
    avatar: "SM",
    result: "340% conversion increase"
  },
  {
    quote: "\"The team moved fast, communicated clearly, and shipped exactly what we needed. Our product story finally feels premium.\"",
    name: "David Kim",
    title: "Founder, OrbitOps",
    avatar: "DK",
    result: "2.1x demo bookings"
  },
  {
    quote: "\"From UX to performance, every detail improved. Our bounce rate dropped and purchase flow became noticeably smoother.\"",
    name: "Amara Jones",
    title: "Growth Lead, NovaMart",
    avatar: "AJ",
    result: "47% lower bounce rate"
  }
];

const quoteEl = document.getElementById("quote");
const nameEl = document.getElementById("person-name");
const titleEl = document.getElementById("person-title");
const avatarEl = document.getElementById("avatar");
const resultEl = document.getElementById("result-pill");
const testimonialCard = document.getElementById("testimonial-card");
const dotsWrap = document.getElementById("carousel-dots");
const prevBtn = document.getElementById("prev-testimonial");
const nextBtn = document.getElementById("next-testimonial");
let activeIndex = 0;
let wheelLocked = false;

function renderDots() {
  dotsWrap.innerHTML = "";
  testimonials.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.className = "dot-btn" + (idx === activeIndex ? " active" : "");
    dot.setAttribute("aria-label", "Go to testimonial " + (idx + 1));
    dot.addEventListener("click", () => {
      activeIndex = idx;
      renderTestimonial();
    });
    dotsWrap.appendChild(dot);
  });
}

function renderTestimonial() {
  const t = testimonials[activeIndex];
  testimonialCard.classList.remove("testimonial-anim");
  void testimonialCard.offsetWidth;
  quoteEl.textContent = t.quote;
  nameEl.textContent = t.name;
  titleEl.textContent = t.title;
  avatarEl.textContent = t.avatar;
  resultEl.textContent = t.result;
  testimonialCard.classList.add("testimonial-anim");
  renderDots();
}

prevBtn.addEventListener("click", () => {
  activeIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
  renderTestimonial();
});
nextBtn.addEventListener("click", () => {
  activeIndex = (activeIndex + 1) % testimonials.length;
  renderTestimonial();
});
testimonialCard.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (wheelLocked) return;
  wheelLocked = true;
  if (event.deltaY > 0) {
    activeIndex = (activeIndex + 1) % testimonials.length;
  } else {
    activeIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
  }
  renderTestimonial();
  setTimeout(() => { wheelLocked = false; }, 420);
}, { passive: false });
renderTestimonial();

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);
reveals.forEach((r) => observer.observe(r));
