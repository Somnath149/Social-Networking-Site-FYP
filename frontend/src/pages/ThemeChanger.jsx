import React, { useEffect, useState } from "react";
import ThreadHome from "./ThreadHome";
import Home from "./Home";
import LeftSide from "../component/LeftSide";
import Feed from "../component/Feed";
import RightSide from "../component/RightSide";


const defaultThemes = [
  { name: "Default", class: "theme-default", colors: ["#ffffff", "#000000"] },
  { name: "Theme1", class: "theme-1", colors: ["#393E46", "#00ADB5"] },
  { name: "Theme2", class: "theme-2", colors: ["#393E46", "#00ADB5"] },
  { name: "Midnight Ocean", class: "theme-midnight-ocean", colors: ["#0f4c75", "#3282b8"] },
  { name: "Sunset Glow", class: "theme-sunset-glow", colors: ["#ff6b6b", "#feca57"] },
  { name: "Electric Violet", class: "theme-electric-violet", colors: ["#8a2be2", "#da70d6"] },
  { name: "Ocean Breeze", class: "theme-ocean-breeze", colors: ["#0284c7", "#67e8f9"] },
  { name: "Rose Quartz", class: "theme-rose-quartz", colors: ["#f67280", "#ffaaa5"] },
  { name: "Mint Fresh", class: "theme-mint-fresh", colors: ["#22c55e", "#86efac"] },
  { name: "Light", class: "theme-light", colors: ["#2563eb", "#93c5fd"] },
  { name: "Dark", class: "theme-dark", colors: ["#3b82f6", "#1e3a8a"] },
  { name: "Purple", class: "theme-purple", colors: ["#a855f7", "#d8b4fe"] },
  { name: "Emerald", class: "theme-emerald", colors: ["#10b981", "#6ee7b7"] },
  { name: "Orange", class: "theme-orange", colors: ["#fb923c", "#fdba74"] },
  { name: "Pink", class: "theme-pink", colors: ["#ec4899", "#f9a8d4"] },
  { name: "Ocean", class: "theme-ocean", colors: ["#0284c7", "#67e8f9"] },
  { name: "Neon", class: "theme-neon", colors: ["#0ef", "#0ff"] },
];

export default function ThemeChanger() {

  const savedCustomThemes = JSON.parse(localStorage.getItem("customThemes") || "[]");
  const [themes, setThemes] = useState([...defaultThemes, ...savedCustomThemes]);

  const [activeTheme, setActiveTheme] = useState(
    localStorage.getItem("theme") || "theme-default"
  );


  const [editorOpen, setEditorOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const emptyTheme = {
    name: "",
    bg: "#000000",
    text: "#ffffff",
    primary: "#0ef",
    secondary: "#f0f",
    cursor: "ffffff",
  };

  const [customTheme, setCustomTheme] = useState(emptyTheme);

  const applyVariables = (vars) => {
    Object.entries(vars).forEach(([key, val]) =>
      document.documentElement.style.setProperty(key, val)
    );
  };

  const resetVariables = () => {
    ["--bg", "--text", "--primary", "--secondary", "--cursor"].forEach((v) =>
      document.documentElement.style.removeProperty(v)
    );
  };


  useEffect(() => {
    document.documentElement.className = activeTheme;

    if (activeTheme === "theme-default") {
      resetVariables();
      return;
    }

    const custom = themes.find((t) => t.class === activeTheme && t.custom);

    if (custom) applyVariables(custom.variables);
    else resetVariables();

    localStorage.setItem("theme", activeTheme);
  }, [activeTheme, themes]);


  useEffect(() => {
    if (editorOpen) {
      applyVariables({
        "--bg": customTheme.bg,
        "--text": customTheme.text,
        "--primary": customTheme.primary,
        "--secondary": customTheme.secondary,
        "--cursor": customTheme.cursor,
      });
    }
  }, [customTheme, editorOpen]);


  const saveTheme = () => {
    if (!customTheme.name.trim()) return alert("Enter theme name!");

    const newObj = {
      name: customTheme.name,
      class: "custom-" + customTheme.name.toLowerCase().replace(/\s+/g, "-"),
      custom: true,
      variables: {
        "--bg": customTheme.bg,
        "--text": customTheme.text,
        "--primary": customTheme.primary,
        "--secondary": customTheme.secondary,
        "--cursor": customTheme.cursor,
      },
      colors: [customTheme.bg, customTheme.primary],
    };

    const updated = [...themes];
    editIndex !== null ? (updated[editIndex] = newObj) : updated.push(newObj);

    setThemes(updated);
    localStorage.setItem(
      "customThemes",
      JSON.stringify(updated.filter((t) => t.custom))
    );

    setEditorOpen(false);
    setEditIndex(null);
  };


  const editTheme = (t, index) => {
    setEditIndex(index);
    setCustomTheme({
      name: t.name,
      bg: t.variables["--bg"],
      text: t.variables["--text"],
      primary: t.variables["--primary"],
      secondary: t.variables["--secondary"],
      cursor: t.variables["--cursor"]
    });
    setEditorOpen(true);
  };

  const deleteTheme = (index) => {
    if (!window.confirm("Delete this theme permanently?")) return;

    const updated = themes.filter((_, i) => i !== index);
    setThemes(updated);

    localStorage.setItem(
      "customThemes",
      JSON.stringify(updated.filter((t) => t.custom))
    );

    setActiveTheme("theme-default");
    localStorage.setItem("theme", "theme-default");
  };

  const cancelEditor = () => {
    setEditorOpen(false);

    if (activeTheme === "theme-default") {
      resetVariables();
      return;
    }

    const active = themes.find((t) => t.class === activeTheme);

    if (active?.custom) applyVariables(active.variables);
    else resetVariables();
  };

  return (
    <div className="p-4 sm:p-5 bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl">

  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
    <h2 className="text-lg sm:text-xl font-bold text-black text-center sm:text-left">
      Themes
    </h2>

    <button
      onClick={() => {
        setCustomTheme(emptyTheme);
        setEditIndex(null);
        setEditorOpen(true);
      }}
      className="bg-[var(--primary)] text-[var(--text)] px-3 py-1 rounded-lg font-semibold self-center sm:self-auto"
    >
      + Add Theme
    </button>
  </div>

  <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3">
    {themes.map((t, index) => (
      <div key={t.class} className="flex flex-col items-center relative min-w-[72px]">
        <button
          onClick={() => {
            setActiveTheme(t.class);
            localStorage.setItem("theme", t.class);
          }}
          className={`flex flex-col items-center p-2 rounded-xl transition-all 
            ${activeTheme === t.class
              ? "ring-2 ring-[var(--primary)] scale-105"
              : "hover:scale-105"
            }`}
        >
          <span
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/40 shadow"
            style={{
              background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})`,
            }}
          ></span>

          <span className="text-[10px] sm:text-xs font-semibold text-black mt-1 text-center">
            {t.name}
          </span>
        </button>

        {t.custom && (
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => editTheme(t, index)}
              className="text-blue-600 text-[10px] sm:text-xs underline"
            >
              Edit
            </button>
            <button
              onClick={() => deleteTheme(index)}
              className="text-red-600 text-[10px] sm:text-xs underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ))}
  </div>

  {editorOpen && (
    <div className="fixed z-1111 inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center px-3">
      <div className="bg-white p-4 sm:p-5 rounded-lg w-full max-w-[300px] space-y-3 shadow-xl">

        <h3 className="text-base sm:text-lg font-bold text-center sm:text-left">
          {editIndex !== null ? "Edit Theme" : "Create Theme"}
        </h3>

        <input
          type="text"
          placeholder="Theme Name"
          className="w-full border p-2 rounded text-sm"
          value={customTheme.name}
          onChange={(e) =>
            setCustomTheme({ ...customTheme, name: e.target.value })
          }
        />

        {["bg", "text", "primary", "secondary", "cursor"].map((key) => (
          <div
            key={key}
            className="flex justify-between items-center text-sm"
          >
            <label className="capitalize">{key}:</label>
            <input
              type="color"
              value={customTheme[key]}
              onChange={(e) =>
                setCustomTheme({ ...customTheme, [key]: e.target.value })
              }
            />
          </div>
        ))}

        <button
          onClick={saveTheme}
          className="w-full bg-green-600 text-white py-2 rounded-lg text-sm"
        >
          Save
        </button>

        <button
          onClick={cancelEditor}
          className="w-full bg-gray-300 text-black py-2 rounded-lg text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )}

  <section
  className="w-full h-[100vh] mt-4 p-4 sm:p-6 rounded-2xl shadow-lg 
  bg-[var(--bg)] text-[var(--text)] border border-[var(--primary)] overflow-y-auto"
>
  {/* Header Skeleton */}
  <div className="h-6 w-56 bg-[var(--text)] rounded-md mb-6 "></div>

  <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-4">
    
    {/* Left Sidebar Skeleton */}
    <div className="hidden lg:block w-[260px]  space-y-4 ">
      <div className="h-10 w-40 bg-[var(--text)] rounded"></div>

      {[1,2,3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-400/20"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24  bg-[var(--text)] rounded"></div>
            <div className="h-3 w-16 bg-[var(--text)] rounded"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Feed Skeleton */}
    <div className="flex-1 max-w-xl w-full space-y-6 ">
      {/* Story bar */}
      <div className="flex gap-3 overflow-hidden">
        {[1,2,3,4,5].map((i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-full bg-gray-400/20"
          ></div>
        ))}
      </div>

      {/* Post Skeleton */}
      <div className="bg-[var(--primary)] rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--text)]"></div>
          <div className="h-4 w-32 bg-[var(--text)] rounded"></div>
        </div>

        <div className="w-full h-64 bg-[var(--secondary)] rounded-xl"></div>

        <div className="flex gap-4">
          <div className="w-6 h-6 bg-[var(--text)] rounded"></div>
          <div className="w-6 h-6 bg-[var(--text)] rounded"></div>
          <div className="w-6 h-6 bg-[var(--text)] rounded"></div>
        </div>
      </div>
    </div>

    {/* Right Sidebar Skeleton */}
    <div className="hidden lg:block w-[260px] space-y-4 ">
      <div className="h-6 w-32 bg-[var(--text)] rounded"></div>

      {[1,2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-400/20"></div>
          <div className="h-3 w-24 bg-[var(--text)] rounded"></div>
        </div>
      ))}
    </div>

  </div>
  
</section>

</div>

  );
}
