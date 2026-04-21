"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { domine } from "@/fonts";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaDiscord } from "react-icons/fa6";
import { RiNotionLine } from "react-icons/ri";

// ── Scroll-reveal wrapper ────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </Box>
  );
}

// ── Scroll-reveal from side (for clouds) ─────────────────────────────
function CloudReveal({
  children,
  fromLeft,
  delay = 0,
}: {
  children: React.ReactNode;
  fromLeft: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.04 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const tx = fromLeft ? "-70px" : "70px";
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${tx})`,
        transition: `opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Shared mockup primitives ─────────────────────────────────────────

function MockWindow({
  color,
  title,
  rows = 3,
  style,
}: {
  color: string;
  title: string;
  rows?: number;
  style?: React.CSSProperties;
}) {
  const palettes: Record<string, { bg: string; line: string }> = {
    blue: { bg: "#DBEAFE", line: "#93C5FD" },
    amber: { bg: "#FEF3C7", line: "#FCD34D" },
    purple: { bg: "#EDE9FE", line: "#C4B5FD" },
    green: { bg: "#DCFCE7", line: "#86EFAC" },
  };
  const p = palettes[color] ?? palettes.blue;
  const headers: Record<string, string> = {
    blue: "#3B82F6",
    amber: "#F59E0B",
    purple: "#8B5CF6",
    green: "#22C55E",
  };
  return (
    <div
      style={{
        background: "white",
        borderRadius: 10,
        boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          background: headers[color] ?? "#3B82F6",
          padding: "5px 8px",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <div style={{ display: "flex", gap: 3 }}>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.55)",
            }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.35)",
            }}
          />
        </div>
        <span style={{ fontSize: 9, color: "white", fontWeight: 700 }}>
          {title}
        </span>
      </div>
      <div style={{ padding: "7px 9px" }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 5,
              borderRadius: 99,
              background: i % 2 === 0 ? p.bg : p.line,
              opacity: 1 - i * 0.12,
              marginBottom: i < rows - 1 ? 5 : 0,
              width: `${[100, 75, 85, 60, 90][i % 5]}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function FloatingBadge({
  children,
  style,
  dark = false,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        background: dark ? "#166534" : "white",
        color: dark ? "white" : "#1F1F1F",
        borderRadius: 12,
        padding: "7px 11px",
        boxShadow: dark
          ? "0 4px 16px rgba(22,101,52,0.35)"
          : "0 4px 20px rgba(0,0,0,0.13)",
        fontSize: 11,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Illustrations ────────────────────────────────────────────────────

// Context switching illustration — keyframes, data, sub-components

const CS_STYLES = `
  @keyframes cs-floatLeft {
    0%,100% { transform: translateY(-50%) translateX(0px); }
    50%      { transform: translateY(-50%) translateX(-5px); }
  }
  @keyframes cs-floatRight {
    0%,100% { transform: translateY(-50%) translateX(0px); }
    50%      { transform: translateY(-50%) translateX(5px); }
  }
  @keyframes cs-floatDown {
    0%,100% { transform: translateX(-50%) translateY(0px); }
    50%      { transform: translateX(-50%) translateY(6px); }
  }
  @keyframes cs-ringPulse {
    0%,100% { box-shadow: 0 0 0 6px rgba(220,38,38,0.07), 0 0 0 14px rgba(220,38,38,0.03); }
    50%      { box-shadow: 0 0 0 11px rgba(220,38,38,0.12), 0 0 0 22px rgba(220,38,38,0.05); }
  }
  @keyframes cs-qRise {
    0%   { opacity:0;   transform:translateY(0px);   }
    15%  { opacity:0.8; }
    80%  { opacity:0.3; transform:translateY(-20px); }
    100% { opacity:0;   transform:translateY(-28px); }
  }
  .cs-pill:hover { background: rgba(0,0,0,0.05) !important; }
`;

type CSApp = {
  name: string;
  bg: string;
  icon?: string;
  color?: string;
  fw?: number;
  fs?: number;
};

type CSClusterData = {
  id: string;
  label: string;
  labelColor: string;
  cardBg: string;
  cardBorder: string;
  glow: string;
  position: Record<string, string>;
  animation: string;
  apps: CSApp[];
};

const CS_CLUSTERS: CSClusterData[] = [
  {
    id: "flash",
    label: "Flashcard apps",
    labelColor: "#8B5CF6",
    cardBg: "rgba(139,92,246,0.06)",
    cardBorder: "rgba(139,92,246,0.2)",
    glow: "rgba(139,92,246,0.1)",
    position: { top: "50%", left: "2%" },
    animation: "cs-floatLeft 4.3s ease-in-out infinite",
    apps: [
      { name: "Anki", bg: "#0093D0" },
      { name: "Quizlet", bg: "#4257B2" },
      {
        name: "Brainscape",
        bg: "#E05A2B",
        icon: "B!",
        color: "#fff",
        fw: 800,
        fs: 10,
      },
    ],
  },
  {
    id: "notes",
    label: "Note-taking apps",
    labelColor: "#3B82F6",
    cardBg: "rgba(59,130,246,0.06)",
    cardBorder: "rgba(59,130,246,0.2)",
    glow: "rgba(59,130,246,0.1)",
    position: { bottom: "1%", left: "50%" },
    animation: "cs-floatDown 4.8s ease-in-out infinite 0.5s",
    apps: [
      { name: "Notion", bg: "#1a1a1a" },
      { name: "Obsidian", bg: "#4B2DA4" },
      { name: "Evernote", bg: "#14A249" },
    ],
  },
  {
    id: "bookmark",
    label: "Bookmark apps",
    labelColor: "#F59E0B",
    cardBg: "rgba(245,158,11,0.06)",
    cardBorder: "rgba(245,158,11,0.2)",
    glow: "rgba(245,158,11,0.1)",
    position: { top: "50%", right: "2%" },
    animation: "cs-floatRight 4s ease-in-out infinite 1s",
    apps: [
      { name: "Chrome", bg: "#E8EAED" },
      { name: "Raindrop", bg: "#0284C7" },
      {
        name: "Pocket",
        bg: "#EF4056",
        icon: "P",
        color: "#fff",
        fw: 800,
        fs: 14,
      },
    ],
  },
];

const CS_QMARKS = [
  { top: "7%", left: "44%", fs: 17, delay: "0s", dur: "2.9s" },
  { top: "2%", left: "52%", fs: 12, delay: "1.1s", dur: "3.3s" },
  { top: "13%", left: "49%", fs: 9, delay: "1.9s", dur: "2.6s" },
  { top: "5%", left: "51%", fs: 14, delay: "2.5s", dur: "3.6s" },
];

function CSAppIcon({ app }: { app: CSApp }) {
  if (app.name === "Notion") {
    return (
      <RiNotionLine
        style={{ width: 18, height: 18, color: "#fff", display: "block" }}
      />
    );
  }
  if (app.name === "Anki") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        style={{ display: "block" }}
      >
        <path
          d="m15.845 22.627l-.169.131l-.182.091a1.3 1.3 0 0 1-.362.079c-.27.021-.611-.036-.989-.16c-.686-.223-1.537-.67-2.256-.973c-.343-.145-.633-.281-.829-.254c-.197.027-.44.236-.73.467c-.611.486-1.311 1.145-1.91 1.546c-.331.22-.644.368-.91.42q-.196.038-.37.021l-.201-.038l-.196-.082l-.177-.119l-.143-.145a1.3 1.3 0 0 1-.187-.32c-.104-.25-.154-.593-.154-.99c.001-.721.164-1.669.23-2.447c.031-.37.07-.687-.016-.866s-.359-.345-.67-.55c-.65-.431-1.494-.893-2.06-1.34c-.312-.246-.548-.498-.681-.735a1.3 1.3 0 0 1-.134-.345l-.025-.202l.016-.213l.059-.205l.094-.18q.095-.147.246-.277c.207-.175.517-.33.895-.452c.685-.222 1.637-.361 2.397-.539c.362-.084.676-.145.819-.281c.144-.138.217-.45.316-.808c.209-.752.387-1.696.638-2.373c.138-.373.305-.676.489-.874q.137-.147.286-.235l.185-.086l.207-.051l.214-.006l.2.033q.17.045.339.148c.231.143.473.389.706.711c.424.584.85 1.446 1.253 2.114c.192.318.347.598.522.692c.174.094.494.068.865.052c.78-.034 1.734-.157 2.455-.128c.397.017.736.081.983.195q.18.083.31.201l.14.148l.112.181l.072.201l.03.202q.01.173-.036.368c-.063.263-.223.57-.457.891c-.425.583-1.113 1.254-1.623 1.845c-.244.281-.463.514-.498.71c-.035.194.089.49.219.838c.273.731.684 1.601.879 2.295c.108.382.151.725.119.995a1.3 1.3 0 0 1-.095.358l-.098.179zm-1.54-18.929c-.018-.057-.07-.226-.122-.346c-.17-.387-.418-.846-.544-1.216c-.166-.483-.099-.88.102-1.096c.201-.214.592-.308 1.086-.177c.377.1.851.316 1.249.458c.125.044.297.084.354.096c.047-.032.193-.134.291-.221c.316-.282.675-.659.988-.894c.408-.305.807-.366 1.074-.241c.266.124.476.468.504.977c.021.391-.037.909-.049 1.331c-.004.132.011.309.017.366c.046.035.187.142.301.209c.365.213.835.438 1.155.662c.417.294.597.655.56.947c-.035.293-.296.599-.773.782c-.365.141-.875.246-1.28.364c-.126.037-.29.106-.343.129c-.019.056-.077.223-.105.351c-.091.413-.159.93-.274 1.304c-.151.487-.438.77-.727.826s-.661-.098-.983-.494c-.246-.303-.504-.756-.742-1.105a3 3 0 0 0-.229-.287a4 4 0 0 0-.366.009c-.421.042-.933.135-1.324.141c-.51.008-.867-.177-1.011-.435c-.142-.257-.11-.659.167-1.088c.212-.328.563-.713.822-1.047c.08-.104.171-.256.202-.305"
          fill="#fff"
        />
      </svg>
    );
  }
  if (app.name === "Quizlet") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        style={{ display: "block" }}
      >
        <path
          d="M12.779.025a11.8 11.8 0 0 0-5.338.896A11.8 11.8 0 0 0 3.058 4.11A11.93 11.93 0 0 0 .427 14.363a11.9 11.9 0 0 0 2.3 4.921a11.84 11.84 0 0 0 4.24 3.378a11.78 11.78 0 0 0 10.533-.226a.33.33 0 0 1 .331.018a9.14 9.14 0 0 0 5.197 1.545a.33.33 0 0 0 .332-.332v-4.038a.334.334 0 0 0-.276-.331a4.7 4.7 0 0 1-1.106-.319a.33.33 0 0 1-.191-.352a.3.3 0 0 1 .05-.133a11.94 11.94 0 0 0 .772-11.871a11.87 11.87 0 0 0-4.042-4.628A11.8 11.8 0 0 0 12.765.018zM4.843 11.898a7.24 7.24 0 0 1 1.205-4.005a7.2 7.2 0 0 1 3.215-2.657a7.13 7.13 0 0 1 7.815 1.558a7.24 7.24 0 0 1 1.555 7.854a7.2 7.2 0 0 1-2.643 3.234a7.15 7.15 0 0 1-9.049-.896a7.23 7.23 0 0 1-2.103-5.089z"
          fill="#fff"
        />
      </svg>
    );
  }
  if (app.name === "Obsidian") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        style={{ display: "block" }}
      >
        <path
          d="M19.355 18.538a68.967 68.959 0 0 0 1.858-2.954a.81.81 0 0 0-.062-.9c-.516-.685-1.504-2.075-2.042-3.362c-.553-1.321-.636-3.375-.64-4.377a1.7 1.7 0 0 0-.358-1.05l-3.198-4.064a4 4 0 0 1-.076.543c-.106.503-.307 1.004-.536 1.5c-.134.29-.29.6-.446.914l-.31.626c-.516 1.068-.997 2.227-1.132 3.59c-.124 1.26.046 2.73.815 4.481q.192.016.386.044a6.36 6.36 0 0 1 3.326 1.505c.916.79 1.744 1.922 2.415 3.5zM8.199 22.569q.11.019.22.02c.78.024 2.095.092 3.16.29c.87.16 2.593.64 4.01 1.055c1.083.316 2.198-.548 2.355-1.664c.114-.814.33-1.735.725-2.58l-.01.005c-.67-1.87-1.522-3.078-2.416-3.849a5.3 5.3 0 0 0-2.778-1.257c-1.54-.216-2.952.19-3.84.45c.532 2.218.368 4.829-1.425 7.531zM5.533 9.938q-.035.15-.098.29L2.82 16.059a1.6 1.6 0 0 0 .313 1.772l4.116 4.24c2.103-3.101 1.796-6.02.836-8.3c-.728-1.73-1.832-3.081-2.55-3.831zM9.32 14.01c.615-.183 1.606-.465 2.745-.534c-.683-1.725-.848-3.233-.716-4.577c.154-1.552.7-2.847 1.235-3.95q.17-.35.328-.664c.149-.297.288-.577.419-.86c.217-.47.379-.885.46-1.27c.08-.38.08-.72-.014-1.043c-.095-.325-.297-.675-.68-1.06a1.6 1.6 0 0 0-1.475.36l-4.95 4.452a1.6 1.6 0 0 0-.513.952l-.427 2.83c.672.59 2.328 2.316 3.335 4.711q.136.317.253.653"
          fill="#C4B5FD"
        />
      </svg>
    );
  }
  if (app.name === "Evernote") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        style={{ display: "block" }}
      >
        <path
          d="M8.222 5.393c0 .239-.02.637-.256.895c-.257.24-.652.259-.888.259H4.552c-.73 0-1.165 0-1.46.04c-.159.02-.356.1-.455.14c-.04.019-.04 0-.02-.02L8.38.796c.02-.02.04-.02.02.02c-.04.099-.118.298-.138.457c-.04.298-.04.736-.04 1.472v2.647zm5.348 17.869c-.67-.438-1.026-1.015-1.164-1.373a2.9 2.9 0 0 1-.217-1.095a3.007 3.007 0 0 1 3-3.004c.493 0 .888.398.888.895a.88.88 0 0 1-.454.776c-.099.06-.237.1-.336.12c-.098.02-.473.06-.65.218c-.198.16-.356.418-.356.697c0 .298.118.577.316.776c.355.358.829.557 1.342.557a2.436 2.436 0 0 0 2.427-2.447c0-1.214-.809-2.29-1.875-2.766c-.158-.08-.414-.14-.651-.2a8 8 0 0 0-.592-.1c-.829-.1-2.901-.755-3.04-2.605c0 0-.611 2.785-1.835 3.54c-.118.06-.276.12-.454.16c-.177.04-.374.06-.434.06c-1.993.12-4.105-.517-5.565-2.03c0 0-.987-.815-1.5-3.103c-.118-.558-.355-1.553-.493-2.488c-.06-.338-.08-.597-.099-.836c0-.975.592-1.631 1.342-1.73h4.026c.69 0 1.086-.18 1.342-.42c.336-.317.415-.775.415-1.312V1.354C9.05.617 9.703 0 10.669 0h.474c.197 0 .434.02.651.04c.158.02.296.06.533.12c1.204.298 1.46 1.532 1.46 1.532s2.27.398 3.415.597c1.085.199 3.77.378 4.282 3.104c1.204 6.487.474 12.775.415 12.775c-.849 6.129-5.901 5.83-5.901 5.83a4.1 4.1 0 0 1-2.428-.736m4.54-13.034c-.652-.06-1.204.2-1.402.697c-.04.1-.079.219-.059.278s.06.08.099.1c.237.12.631.179 1.204.239c.572.06.967.1 1.223.06c.04 0 .08-.02.119-.08c.04-.06.02-.18.02-.28c-.06-.536-.553-.934-1.204-1.014"
          fill="#fff"
        />
      </svg>
    );
  }
  if (app.name === "Chrome") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        style={{ display: "block" }}
      >
        <path
          d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0"
          fill="#EA4335"
        />
        <path
          d="M1.931 5.47A11.94 11.94 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29z"
          fill="#34A853"
        />
        <path
          d="M13.273 7.636a5.446 5.446 0 0 1 1.45 7.09l-5.344 9.257q.309.015.621.016c6.627 0 12-5.373 12-12c0-1.54-.29-3.011-.818-4.364z"
          fill="#FBBC05"
        />
        <circle cx="12" cy="12" r="4.364" fill="#4285F4" />
        <circle cx="12" cy="12" r="2.5" fill="#E8EAED" />
      </svg>
    );
  }
  if (app.name === "Raindrop") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        style={{ display: "block" }}
      >
        <path
          d="M12 3C12 3 5.5 10.5 5.5 15.5a6.5 6.5 0 0 0 13 0C18.5 10.5 12 3 12 3z"
          fill="#38BDF8"
        />
        <path
          d="M9.5 14c0-1.8 1.2-4 2.5-5.8"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse
          cx="10"
          cy="15"
          rx="1"
          ry="1.5"
          fill="rgba(255,255,255,0.35)"
          transform="rotate(-15 10 15)"
        />
      </svg>
    );
  }
  return (
    <span
      style={{
        fontSize: app.fs ?? 13,
        fontWeight: app.fw ?? 400,
        color: app.color ?? "inherit",
        lineHeight: 1,
      }}
    >
      {app.icon}
    </span>
  );
}

function CSAppPill({ app }: { app: CSApp }) {
  return (
    <div
      className="cs-pill"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "5px 10px 5px 5px",
        borderRadius: 99,
        background: "rgba(0,0,0,0.03)",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "background 0.2s",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: app.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <CSAppIcon app={app} />
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "#4B4B4B",
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        {app.name}
      </span>
    </div>
  );
}

function CSCluster({
  data,
  scale,
  clusterRef,
}: {
  data: CSClusterData;
  scale: number;
  clusterRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const isBottom = "bottom" in data.position;
  const origin =
    data.id === "flash"
      ? "left center"
      : data.id === "bookmark"
        ? "right center"
        : "center bottom";
  return (
    <div
      ref={clusterRef}
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        animation: data.animation,
        zIndex: 6,
        transformOrigin: origin,
        ...(scale < 1 ? { scale: String(scale) } : {}),
        ...data.position,
        ...(isBottom ? {} : { transform: "translateY(-50%)" }),
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          textAlign: "center",
          color: data.labelColor,
          marginBottom: 2,
        }}
      >
        {data.label}
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: "11px 12px",
          borderRadius: 16,
          background: data.cardBg,
          border: `1px solid ${data.cardBorder}`,
          boxShadow: `0 2px 16px rgba(0,0,0,0.06), 0 0 32px ${data.glow}`,
        }}
      >
        {data.apps.map((app) => (
          <CSAppPill key={app.name} app={app} />
        ))}
      </div>
    </div>
  );
}

function ContextSwitchingIllustration() {
  return (
    <Image
      maxW="30em"
      src="/context-switching.png"
      alt="someone who is using a lot of platforms for learning"
    />
  );
}

function BookmarkingPainIllustration() {
  const levels = [
    { indent: 0, label: "📁 Browser Bookmarks", color: "#F59E0B", delay: "0s" },
    { indent: 1, label: "📁 Tech", color: "#F59E0B", delay: "0.12s" },
    { indent: 2, label: "📁 Programming", color: "#F59E0B", delay: "0.24s" },
    { indent: 3, label: "📁 Web Dev", color: "#F59E0B", delay: "0.36s" },
    { indent: 4, label: "🔖 React Tutorial", color: "#DC2626", delay: "0.5s" },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
        padding: 16,
      }}
    >
      {/* Main card */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          boxShadow: "0 6px 24px rgba(0,0,0,0.09)",
          padding: "12px 14px",
          animation: "ilFloat1 5s ease-in-out infinite",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#1F1F1F",
            marginBottom: 10,
          }}
        >
          Browser Bookmarks
        </div>
        {levels.map((l, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              paddingLeft: l.indent * 14,
              marginBottom: i < levels.length - 1 ? 6 : 0,
              opacity: 1 - i * 0.1,
              animation: `ilFadeUp 0.5s ease ${l.delay} both`,
            }}
          >
            <div
              style={{
                background: i === levels.length - 1 ? "#DC2626" : l.color,
                borderRadius: "50%",
                flexShrink: 0,
                width: 6,
                height: 6,
              }}
            />
            <span
              style={{
                fontSize: 9.5,
                color: i === levels.length - 1 ? "#DC2626" : "#374151",
                fontWeight: i === levels.length - 1 ? 700 : 500,
              }}
            >
              {l.label}
            </span>
          </div>
        ))}
      </div>
      {/* Floating badge */}
      <FloatingBadge
        style={{
          bottom: 14,
          right: 12,
          animation: "ilSlideLeft 0.5s ease 0.8s both",
          fontSize: 10,
        }}
      >
        <span style={{ color: "#DC2626" }}>⚠</span> Last seen 89 days ago
      </FloatingBadge>
    </div>
  );
}

function ReviewingPainIllustration() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
        padding: 16,
      }}
    >
      {/* Main notes card */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          boxShadow: "0 6px 24px rgba(0,0,0,0.09)",
          padding: "11px 13px",
          animation: "ilFloat2 5s ease-in-out infinite",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#1F1F1F",
            marginBottom: 8,
          }}
        >
          📓 My Notes
        </div>
        {/* Lines with highlights */}
        {[
          { w: "100%", highlight: false },
          { w: "80%", highlight: true },
          { w: "90%", highlight: false },
          { w: "65%", highlight: true },
          { w: "85%", highlight: false },
        ].map((l, i) => (
          <div
            key={i}
            style={{
              height: 7,
              borderRadius: 4,
              background: l.highlight ? "#FDE68A" : "#F3F4F6",
              width: l.w,
              marginBottom: 5,
              opacity: 1 - i * 0.08,
            }}
          />
        ))}
        {/* Empty review section */}
        <div
          style={{
            marginTop: 10,
            background: "#FFF1F2",
            borderRadius: 8,
            padding: "7px 10px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            border: "1px solid #FECDD3",
          }}
        >
          <span style={{ fontSize: 14 }}>🃏</span>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "#9F1239" }}>
              No flashcards
            </div>
            <div style={{ fontSize: 8.5, color: "#FB7185" }}>
              Not set up yet
            </div>
          </div>
        </div>
      </div>
      <FloatingBadge
        style={{
          bottom: 12,
          left: 12,
          animation: "ilSlideRight 0.5s ease 0.9s both",
        }}
      >
        <span>🔴</span> 0 reviews due
      </FloatingBadge>
    </div>
  );
}

function OnePlatformIllustration() {
  const modules = [
    { icon: "✅", label: "Notes", color: "#22C55E", active: false, done: true },
    {
      icon: "✅",
      label: "Bookmarks",
      color: "#22C55E",
      active: false,
      done: true,
    },
    {
      icon: "▶",
      label: "Flashcards",
      color: "#3B82F6",
      active: true,
      done: false,
    },
    {
      icon: "4",
      label: "Practice tasks",
      color: "#D1D5DB",
      active: false,
      done: false,
    },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
        padding: 14,
      }}
    >
      {/* Main card */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          boxShadow: "0 6px 24px rgba(0,0,0,0.09)",
          padding: "11px 13px",
          animation: "ilFloat1 5s ease-in-out infinite",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #DBEAFE, #EDE9FE)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            📚
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#1F1F1F" }}>
              Learn: React Basics
            </div>
            <div style={{ fontSize: 9, color: "#9CA3AF" }}>
              Beginner → Job-ready · 8 weeks
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              height: 7,
              background: "#F3F4F6",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #3B82F6, #6366F1)",
                borderRadius: 99,
                animation:
                  "ilProgressFill 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s both",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <span style={{ fontSize: 8.5, color: "#9CA3AF" }}>Progress</span>
            <span style={{ fontSize: 8.5, color: "#9CA3AF" }}>
              67% complete
            </span>
          </div>
        </div>
        {/* Module list */}
        {modules.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 8px",
              borderRadius: 8,
              marginBottom: 3,
              background: m.active ? "#EFF6FF" : "transparent",
              border: m.active ? "1px solid #BFDBFE" : "1px solid transparent",
              animation: `ilFadeUp 0.4s ease ${0.1 + i * 0.1}s both`,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                flexShrink: 0,
                background: m.done
                  ? "#22C55E"
                  : m.active
                    ? "#3B82F6"
                    : "#E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                color: m.done || m.active ? "white" : "#9CA3AF",
                fontWeight: 700,
              }}
            >
              {m.icon}
            </div>
            <span
              style={{
                fontSize: 9.5,
                fontWeight: m.active ? 700 : 500,
                color: m.active ? "#1D4ED8" : m.done ? "#374151" : "#9CA3AF",
              }}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>
      {/* Floating badges */}
      <FloatingBadge
        style={{
          top: 8,
          right: 8,
          animation: "ilSlideLeft 0.5s ease 1s both",
          fontSize: 10,
          padding: "6px 10px",
        }}
      >
        🎉 All in one place!
      </FloatingBadge>
      <FloatingBadge
        dark
        style={{
          bottom: 10,
          left: 10,
          animation: "ilSlideRight 0.5s ease 1.1s both",
          fontSize: 10,
          padding: "6px 11px",
        }}
      >
        🏆 Streak: 7 days
      </FloatingBadge>
    </div>
  );
}

function TiedResourcesIllustration() {
  const resources = [
    { label: "React Docs (official)", favicon: "📄" },
    { label: "freeCodeCamp Tutorial", favicon: "🎓" },
    { label: "Dan Abramov's Blog", favicon: "✍️" },
    { label: "Overreacted.io", favicon: "⚡" },
    { label: "React Patterns Guide", favicon: "📐" },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
        padding: 14,
      }}
    >
      {/* Main card */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          boxShadow: "0 6px 24px rgba(0,0,0,0.09)",
          padding: "11px 13px",
          animation: "ilFloat2 5s ease-in-out infinite",
        }}
      >
        {/* Learn header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              background: "#FFFBF0",
              borderRadius: 8,
              padding: "4px 8px",
              border: "1px solid rgba(152,109,0,0.2)",
              fontSize: 9.5,
              fontWeight: 700,
              color: "#7C5800",
            }}
          >
            📚 React Basics
          </div>
          <div style={{ fontSize: 9, color: "#9CA3AF" }}>5 resources</div>
        </div>
        {/* Resource list */}
        {resources.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "4px 7px",
              borderRadius: 7,
              marginBottom: 3,
              background: "#F9FAFB",
              border: "1px solid #F3F4F6",
              animation: `ilFadeUp 0.4s ease ${0.08 * i}s both`,
            }}
          >
            <span style={{ fontSize: 11, flexShrink: 0 }}>{r.favicon}</span>
            <span
              style={{
                fontSize: 9.5,
                color: "#374151",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {r.label}
            </span>
            <div
              style={{
                marginLeft: "auto",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#22C55E",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <FloatingBadge
        style={{
          bottom: 10,
          right: 10,
          animation: "ilSlideLeft 0.5s ease 0.9s both",
          fontSize: 10,
          padding: "6px 10px",
        }}
      >
        📎 Tied to the topic
      </FloatingBadge>
    </div>
  );
}

function FlashcardsIllustration() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
        padding: 14,
      }}
    >
      {/* Notebook */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          boxShadow: "0 6px 24px rgba(0,0,0,0.09)",
          padding: "11px 13px",
          animation: "ilFloat1 5s ease-in-out infinite",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#1F1F1F",
            marginBottom: 8,
          }}
        >
          📓 React Notes
        </div>
        {[100, 80, 90, 70, 85].map((w, i) => (
          <div
            key={i}
            style={{
              height: i === 2 ? 7 : 6,
              borderRadius: 4,
              background: i === 2 ? "#FDE68A" : "#F3F4F6",
              width: `${w}%`,
              marginBottom: 5,
            }}
          />
        ))}
        {/* Add flashcard button highlighted */}
        <div
          style={{
            marginTop: 8,
            background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)",
            borderRadius: 9,
            padding: "7px 10px",
            border: "1.5px dashed #A78BFA",
            display: "flex",
            alignItems: "center",
            gap: 7,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#8B5CF6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "white",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            +
          </div>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "#6D28D9" }}>
              Add Flashcard
            </div>
            <div style={{ fontSize: 8, color: "#A78BFA" }}>
              From highlighted text
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard appearing */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 10,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 8px 28px rgba(139,92,246,0.22)",
          padding: "9px 11px",
          width: 130,
          border: "1.5px solid #DDD6FE",
          animation: "ilPopIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.7s both",
        }}
      >
        <div
          style={{
            fontSize: 8.5,
            fontWeight: 700,
            color: "#6D28D9",
            marginBottom: 5,
          }}
        >
          🃏 New Flashcard
        </div>
        <div
          style={{
            height: 5,
            background: "#EDE9FE",
            borderRadius: 4,
            marginBottom: 4,
            width: "100%",
          }}
        />
        <div
          style={{
            height: 5,
            background: "#EDE9FE",
            borderRadius: 4,
            marginBottom: 4,
            width: "80%",
          }}
        />
        <div
          style={{
            marginTop: 7,
            padding: "5px 7px",
            background: "#F5F3FF",
            borderRadius: 6,
            border: "1px dashed #C4B5FD",
          }}
        >
          <div
            style={{
              height: 4,
              background: "#DDD6FE",
              borderRadius: 3,
              width: "90%",
              marginBottom: 3,
            }}
          />
          <div
            style={{
              height: 4,
              background: "#DDD6FE",
              borderRadius: 3,
              width: "65%",
            }}
          />
        </div>
      </div>

      <FloatingBadge
        dark
        style={{
          bottom: 12,
          left: 12,
          animation: "ilSlideRight 0.5s ease 1.2s both",
          fontSize: 10,
          padding: "6px 10px",
          background: "#4C1D95",
        }}
      >
        ✦ Review in 3 days
      </FloatingBadge>
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────
const IllustrationComponents = {
  ContextSwitching: ContextSwitchingIllustration,
  BookmarkingPain: BookmarkingPainIllustration,
  ReviewingPain: ReviewingPainIllustration,
  OnePlatform: OnePlatformIllustration,
  TiedResources: TiedResourcesIllustration,
  Flashcards: FlashcardsIllustration,
};

type IllustrationKey = keyof typeof IllustrationComponents;

function CombinedFeatureCard({
  painTitle,
  painBullets,
  painIllustrationKey,
  solutionTitle,
  solutionBullets,
  solutionIllustrationKey,
  delay = 0,
  order,
}: {
  painTitle: string;
  painBullets: string[];
  painIllustrationKey: IllustrationKey;
  solutionTitle: string;
  solutionBullets: string[];
  solutionIllustrationKey: IllustrationKey;
  delay?: number;
  order: number;
}) {
  const PainIllustration = IllustrationComponents[painIllustrationKey];
  const SolutionIllustration = IllustrationComponents[solutionIllustrationKey];

  return (
    <Reveal delay={delay}>
      <Box
        bg="white"
        border="1px solid"
        borderColor="stroke"
        rounded="2xl"
        overflow="hidden"
        shadow="0 1px 6px rgba(0,0,0,0.04)"
      >
        {/* <Flex direction={{ base: "column", md: "row" }} align="stretch"> */}
        <Stack>
          {/* ── Problem side ── */}
          <Stack flex="1" gap="5" p={{ base: "6", md: "8" }}>
            <Box
              display="inline-flex"
              alignItems="center"
              gap="2"
              px="3"
              py="1"
              rounded="full"
              bg="rgba(248,113,113,0.12)"
              alignSelf="start"
            >
              <Box w="6px" h="6px" rounded="full" bg="accent.softCoral" />
              <Text textStyle="sm-semibold" color="accent.softCoral">
                #{order} Problem
              </Text>
            </Box>
            <Stack gap="3">
              <Text textStyle="h4" color="text.primary" lineHeight={1.3}>
                {painTitle}
              </Text>
              <Stack gap="3">
                {painBullets.map((b, i) => (
                  <HStack key={i} gap="3" alignItems="start">
                    <Box
                      flexShrink={0}
                      mt="1"
                      w="5"
                      h="5"
                      rounded="full"
                      bg="neutral.surface"
                      border="1px solid"
                      borderColor="stroke"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box w="6px" h="6px" rounded="full" bg="text.caption" />
                    </Box>
                    <Text textStyle="md" color="text.secondary">
                      {b}
                    </Text>
                  </HStack>
                ))}
              </Stack>
            </Stack>
            <Box
              // h={{ base: "200px", md: "220px" }}
              // rounded="xl"
              overflow="hidden"
              m="auto"
              // mt="auto"
            >
              <PainIllustration />
            </Box>
          </Stack>

          {/* ── Divider with arrow ── */}
          <Flex
            direction={{ base: "row", md: "column" }}
            alignItems="center"
            justifyContent="center"
            px={{ base: "8", md: "0" }}
            py={{ base: "0", md: "8" }}
            flexShrink={0}
          >
            <Box
              flex="1"
              display={{ base: "none", md: "block" }}
              w="1px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(214,211,205,0.7), transparent)",
              }}
            />
            <Box
              flex="1"
              display={{ base: "block", md: "none" }}
              h="1px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(214,211,205,0.7), transparent)",
              }}
            />
            <Box
              flexShrink={0}
              my={{ base: "0", md: "2" }}
              mx={{ base: "3", md: "0" }}
            >
              <Box>
                <svg
                  width="54"
                  height="100"
                  viewBox="0 0 54 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M33 5 C55 10, -1 38, 33 50 C53 62, 33 84, 33 95"
                    stroke="#B8B0A8"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    opacity="0.3"
                    fill="none"
                  />
                  <path
                    d="M27 89 L33 95 L39 89"
                    stroke="#B8B0A8"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    opacity="0.3"
                    fill="none"
                  />
                  <path
                    d="M27 5 C49 10, -7 38, 27 50 C47 62, 27 84, 27 95"
                    stroke="#B8B0A8"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    fill="none"
                  />
                  <path
                    d="M21 89 L27 95 L33 89"
                    stroke="#B8B0A8"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                  />
                </svg>
              </Box>
            </Box>
            <Box
              flex="1"
              display={{ base: "none", md: "block" }}
              w="1px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(214,211,205,0.7), transparent)",
              }}
            />
            <Box
              flex="1"
              display={{ base: "block", md: "none" }}
              h="1px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(214,211,205,0.7), transparent)",
              }}
            />
          </Flex>

          {/* ── Solution side ── */}
          <Stack flex="1" gap="5" p={{ base: "6", md: "8" }}>
            <Box
              display="inline-flex"
              alignItems="center"
              gap="2"
              px="3"
              py="1"
              rounded="full"
              bg="rgba(34,197,94,0.12)"
              alignSelf="start"
            >
              <Box w="6px" h="6px" rounded="full" bg="feedback.success" />
              <Text textStyle="sm-semibold" color="feedback.success">
                The Solution
              </Text>
            </Box>
            <Stack gap="3">
              <Text textStyle="h4" color="text.primary" lineHeight={1.3}>
                {solutionTitle}
              </Text>
              <Stack gap="3">
                {solutionBullets.map((b, i) => (
                  <HStack key={i} gap="3" alignItems="start">
                    <Box
                      flexShrink={0}
                      mt="1"
                      w="5"
                      h="5"
                      rounded="full"
                      bg="neutral.surface"
                      border="1px solid"
                      borderColor="stroke"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box w="6px" h="6px" rounded="full" bg="text.caption" />
                    </Box>
                    <Text textStyle="md" color="text.secondary">
                      {b}
                    </Text>
                  </HStack>
                ))}
              </Stack>
            </Stack>
            <Box
              h={{ base: "200px", md: "220px" }}
              rounded="xl"
              overflow="hidden"
              mt="auto"
            >
              <SolutionIllustration />
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Reveal>
  );
}

// ── Cloud SVG (path from user's art) ─────────────────────────────────
function CloudSVG({
  fill = "#E2E3E7",
  width = 173,
  height = 107,
}: {
  fill?: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      viewBox="0 0 173 107"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M153.4,242.9c10.3,0,19.5-4.8,25.5-12.3c5.5,7.7,14.5,12.7,24.7,12.7c9.7,0,18.3-4.6,23.9-11.6 c1.9,1,4.1,1.6,6.5,1.6c7.8,0,14.2-6.4,14.2-14.2c0-0.6-0.1-1.1-0.2-1.7c10.9-5.6,18.5-16.9,18.5-30c0-18.6-15.1-33.7-33.7-33.7 c-3.6,0-7,0.6-10.2,1.6c-7.2-11.2-19.8-18.6-34.1-18.6c-15.4,0-28.7,8.6-35.6,21.2c-2.1-0.4-4.2-0.7-6.4-0.7 c-14.4,0-26.5,10.1-29.5,23.6c-13.1,1-23.5,11.9-23.5,25.3c0,14,11.4,25.4,25.4,25.4c3.1,0,6-0.6,8.7-1.6 C133.2,237.7,142.7,242.9,153.4,242.9z"
        transform="translate(-93.5, -136.7)"
        fill={fill}
      />
    </svg>
  );
}

function LearningJourneySection() {
  return (
    <Box position="relative" py={{ base: "16", md: "24" }} overflow="hidden">
      <Box
        position="absolute"
        top="50%"
        left="50%"
        style={{ transform: "translate(-50%, -50%)" }}
        w="1000px"
        h="800px"
        bg="radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 70%)"
        pointerEvents="none"
      />
      <Container
        maxW="5xl"
        px={{ base: "6", md: "12" }}
        position="relative"
        zIndex={1}
      >
        <Reveal>
          <Stack
            gap="1.5em"
            mb={{ base: "6em", md: "20em" }}
            alignItems="center"
            textAlign="center"
          >
            <Heading as="h1" color="text.primary">
              As a{" "}
              <Box as="span" color="primary">
                learner
              </Box>{" "}
              you typically do these activities
            </Heading>
          </Stack>
        </Reveal>

        <Reveal>
          <Stack
            direction={{ base: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            gap={{ base: "12", md: "20" }}
            py={{ base: "16", md: "0" }}
            mb={{ base: "8em", md: "17em" }}
          >
            <Stack
              flex="1"
              gap="1em"
              textAlign={{ base: "center", md: "start" }}
            >
              <Text
                textStyle="h2"
                fontWeight="bold"
                color="text.primary"
                lineHeight={1.15}
              >
                Deep Focused Learning
              </Text>
              <Text
                textStyle="h5"
                fontWeight="medium"
                color="text.secondary"
                lineHeight={1.6}
              >
                Engaging directly with study materials by reading, watching,
                listening, taking notes, and understanding concepts.
              </Text>
            </Stack>
            <Box flex="1" display="flex" justifyContent="center">
              <Image
                src="/read-and-write.png"
                alt="read and write illustration"
                maxW={{ base: "auto", md: "450px" }}
                w="full"
              />
            </Box>
          </Stack>
        </Reveal>

        <Reveal>
          <Stack
            direction={{ base: "column-reverse", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            py={{ base: "16", md: "0" }}
            mb={{ base: "8em", md: "17em" }}
          >
            <Box
              flex="1"
              display="flex"
              justifyContent="flex-start"
              transform={{ base: "none", md: "translateX(-5em)" }}
            >
              <Image
                src="/search-illustration.png"
                alt="search illustration"
                maxW={{ base: "none", md: "350px" }}
                w="full"
              />
            </Box>
            <Stack
              flex="1"
              gap="1em"
              textAlign={{ base: "center", md: "start" }}
            >
              <Text
                textStyle="h2"
                fontWeight="bold"
                color="text.primary"
                lineHeight={1.15}
              >
                Searching for Resources and Bookmarking
              </Text>
              <Text
                textStyle="h5"
                fontWeight="medium"
                color="text.secondary"
                lineHeight={1.6}
              >
                Finding useful resources from the web, social media, and
                roadmaps, then saving and organizing them for later.
              </Text>
            </Stack>
          </Stack>
        </Reveal>

        <Reveal>
          <Stack
            direction={{ base: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            gap={{ base: "12", md: "20" }}
            py={{ base: "16", md: "0" }}
          >
            <Stack
              flex="1"
              gap="1em"
              textAlign={{ base: "center", md: "start" }}
            >
              <Text
                textStyle="h2"
                fontWeight="bold"
                color="text.primary"
                lineHeight={1.15}
              >
                Active Recall and Spaced Repetition
              </Text>
              <Text
                textStyle="h5"
                fontWeight="medium"
                color="text.secondary"
                lineHeight={1.6}
              >
                Testing yourself to retrieve information and reviewing it at
                increasing intervals to strengthen long-term memory.
              </Text>
            </Stack>
            <Box
              flex="1"
              display="flex"
              justifyContent="center"
              transform="rotate(-25deg) translateY(-4em)"
            >
              <Image
                src="/active-recall.png"
                alt="active recall illustration"
                minW={{ base: "none", md: "350px" }}
                w="full"
              />
            </Box>
          </Stack>
        </Reveal>

        {/* ── Bridge to next section ── */}
        <Reveal delay={520}>
          <Stack alignItems="center" gap="0" my={{ base: "16", md: "30em" }}>
            {/* Clouds + central emoji */}
            <Box
              position="relative"
              w="full"
              minH="340px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {/* ── Left clouds ── */}
              <Box
                position="absolute"
                top="0"
                left="0"
                w="55%"
                h="full"
                pointerEvents="none"
                overflow="visible"
              >
                {/* back, largest */}
                <Box position="absolute" top="0%" left="0">
                  <CloudReveal fromLeft delay={0}>
                    <div className="cloud-float-1">
                      <CloudSVG width={400} height={247} fill="#D8D9DE" />
                    </div>
                  </CloudReveal>
                </Box>
                {/* mid */}
                <Box position="absolute" top="34%" left="4%">
                  <CloudReveal fromLeft delay={120}>
                    <div className="cloud-float-2">
                      <CloudSVG width={310} height={192} fill="#E0E1E6" />
                    </div>
                  </CloudReveal>
                </Box>
                {/* front, smallest */}
                <Box position="absolute" top="64%" left="2%">
                  <CloudReveal fromLeft delay={220}>
                    <div className="cloud-float-3">
                      <CloudSVG width={240} height={148} fill="#E8E9EC" />
                    </div>
                  </CloudReveal>
                </Box>
              </Box>

              {/* ── Right clouds (mirrored) ── */}
              <Box
                position="absolute"
                top="0"
                right="0"
                w="55%"
                h="full"
                pointerEvents="none"
                overflow="visible"
              >
                <Box position="absolute" top="0%" right="0">
                  <CloudReveal fromLeft={false} delay={60}>
                    <div
                      className="cloud-float-2"
                      style={{ transform: "scaleX(-1)" }}
                    >
                      <CloudSVG width={400} height={247} fill="#D8D9DE" />
                    </div>
                  </CloudReveal>
                </Box>
                <Box position="absolute" top="34%" right="4%">
                  <CloudReveal fromLeft={false} delay={160}>
                    <div
                      className="cloud-float-3"
                      style={{ transform: "scaleX(-1)" }}
                    >
                      <CloudSVG width={310} height={192} fill="#E0E1E6" />
                    </div>
                  </CloudReveal>
                </Box>
                <Box position="absolute" top="64%" right="2%">
                  <CloudReveal fromLeft={false} delay={260}>
                    <div
                      className="cloud-float-1"
                      style={{ transform: "scaleX(-1)" }}
                    >
                      <CloudSVG width={240} height={148} fill="#E8E9EC" />
                    </div>
                  </CloudReveal>
                </Box>
              </Box>

              {/* Central emoji */}
              <Flex
                w="72px"
                h="72px"
                rounded="full"
                bg="white"
                alignItems="center"
                justifyContent="center"
                position="relative"
                zIndex={1}
                shadow="0 6px 28px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)"
                border="1px solid"
                borderColor="rgba(0,0,0,0.05)"
              >
                <span style={{ fontSize: 38, lineHeight: 1 }}>🤔</span>
              </Flex>
            </Box>

            {/* Text */}
            <Stack
              gap="3"
              alignItems="center"
              textAlign="center"
              pt="4"
              pb="10"
              px={{ base: "6", md: "0" }}
              maxW="xl"
            >
              <Text textStyle="h3" color="text.primary" lineHeight={1.3}>
                Every activity uses a{" "}
                <Box as="span" color="accent.softCoral">
                  different app.
                </Box>
              </Text>
              <Text textStyle="lg" color="text.secondary" maxW="xl">
                No single tool ties them all together{" "}
                <Box as="span" fontWeight="bold">
                  until now
                </Box>
                . That&apos;s why{" "}
                <Box as="span" color="primary" fontWeight="bold">
                  Elearner
                </Box>{" "}
                exists.
              </Text>
            </Stack>
          </Stack>
        </Reveal>

        {/* ── Learn section ── */}
        <Reveal delay={200}>
          <Stack
            alignItems="center"
            gap="2em"
            my={{ base: "16", md: "24" }}
            px={{ base: "6", md: "0" }}
          >
            <Stack alignItems="center" gap="1em" textAlign="center">
              <Heading as="h2" color="primary" lineHeight={1.3}>
                All Your Learning Activities in One Place
              </Heading>
              <Text textStyle="lg" color="text.secondary">
                Elearner combines{" "}
                <Box as="span" fontWeight="bold" color="primary">
                  notebooks
                </Box>{" "}
                for actual learning,{" "}
                <Box as="span" fontWeight="bold" color="primary">
                  resources
                </Box>{" "}
                for discovery and bookmarking, and{" "}
                <Box as="span" fontWeight="bold" color="primary">
                  flashcards
                </Box>{" "}
                for active recall and spaced repetition — all in a single,
                seamless platform so you can focus on learning instead of
                switching between tools.
              </Text>
            </Stack>
            <Image
              src="/learn-screenshot.png"
              alt="Elearner learn view"
              transform={{ base: "translateX(1em)", md: "translateX(1.3em)" }}
              w="full"
            />
          </Stack>
        </Reveal>
      </Container>
    </Box>
  );
}

// ── Pricing Section ──────────────────────────────────────────────────
function PricingSection() {
  const freeFeatures = [
    "3 learns",
    "15 notebooks",
    "30 flashcards",
    "Unlimited resources",
  ];
  const premiumFeatures = [
    "Unlimited learns",
    "Unlimited notebooks",
    "Unlimited flashcards",
    "Unlimited resources",
  ];

  return (
    <Box
      id="pricing"
      position="relative"
      py={{ base: "16", md: "24" }}
      overflow="hidden"
      bg="neutral.background"
    >
      {/* Background glow */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        style={{ transform: "translate(-50%, -50%)" }}
        w="900px"
        h="600px"
        bg="radial-gradient(ellipse, rgba(152,109,0,0.07) 0%, transparent 68%)"
        pointerEvents="none"
      />

      <Container
        maxW="5xl"
        px={{ base: "6", md: "12" }}
        position="relative"
        zIndex={1}
      >
        <Reveal>
          <Stack
            gap="5"
            alignItems="center"
            textAlign="center"
            mb={{ base: "10", md: "14" }}
          >
            <Text textStyle="h2" color="text.primary" lineHeight={1.2}>
              Simple pricing, Honest plans
            </Text>

            {/* Emphasized sentence */}
            <Box maxW="xl">
              <Text textStyle="lg" color="text.secondary" lineHeight={1.6}>
                We don&apos;t hand you a countdown.{" "}
                <Box as="span" color="primary" fontWeight="bold">
                  We hand you the platform
                </Box>{" "}
                and let the experience speak for itself.
              </Text>
            </Box>
          </Stack>
        </Reveal>

        {/* Plan cards */}
        <Reveal delay={150}>
          <Stack
            direction={{ base: "column", md: "row" }}
            gap={{ base: "5", md: "6" }}
            alignItems={{ base: "stretch", md: "start" }}
            maxW="3xl"
            mx="auto"
          >
            {/* ── Free card ── */}
            <Box
              flex="1"
              bg="white"
              border="1px solid"
              borderColor="stroke"
              rounded="2xl"
              p={{ base: "6", md: "8" }}
              shadow="0 1px 6px rgba(0,0,0,0.04)"
              display="flex"
              flexDirection="column"
              gap="6"
            >
              {/* Plan label */}
              <Stack gap="1">
                <Box
                  display="inline-flex"
                  alignItems="center"
                  gap="2"
                  px="3"
                  py="1"
                  rounded="full"
                  bg="neutral.surface"
                  border="1px solid"
                  borderColor="stroke"
                  alignSelf="start"
                >
                  <Text textStyle="sm-semibold" color="text.secondary">
                    Free
                  </Text>
                </Box>
                <Text textStyle="h3" color="text.primary" mt="2">
                  $0
                </Text>
                <Text textStyle="sm" color="text.caption">
                  No credit card required
                </Text>
              </Stack>

              {/* Divider */}
              <Box h="1px" bg="stroke" />

              {/* Features */}
              <Stack gap="3" flex="1">
                {freeFeatures.map((f, i) => (
                  <HStack key={i} gap="3">
                    <Box
                      flexShrink={0}
                      w="18px"
                      h="18px"
                      rounded="full"
                      bg="neutral.surface"
                      border="1px solid"
                      borderColor="stroke"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path
                          d="M1 3.5L3.5 6L8 1"
                          stroke="#919191"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Text textStyle="sm" color="text.secondary">
                      {f}
                    </Text>
                  </HStack>
                ))}
              </Stack>

              {/* CTA */}
              <Button
                asChild
                size="md"
                variant="secondary"
                rounded="full"
                fontWeight="semibold"
                w="full"
              >
                <NextLink href="/signup">Get Started</NextLink>
              </Button>
            </Box>

            {/* ── Premium card ── */}
            <Box
              flex="1"
              bg="rgba(152,109,0,0.05)"
              border="1.5px solid"
              borderColor="primary"
              rounded="2xl"
              p={{ base: "6", md: "8" }}
              shadow="0 4px 24px rgba(152,109,0,0.15), 0 1px 6px rgba(0,0,0,0.04)"
              display="flex"
              flexDirection="column"
              gap="6"
              position="relative"
            >
              {/* Plan label */}
              <Stack gap="1">
                <Box
                  display="inline-flex"
                  alignItems="center"
                  gap="2"
                  px="3"
                  py="1"
                  rounded="full"
                  bg="rgba(152,109,0,0.12)"
                  alignSelf="start"
                >
                  <Text textStyle="sm-semibold" color="primary">
                    Premium
                  </Text>
                </Box>
                <HStack gap="2" alignItems="baseline" mt="2">
                  <Text textStyle="h3" color="text.primary">
                    $7
                  </Text>
                  <Text textStyle="sm" color="text.caption">
                    / month
                  </Text>
                </HStack>
                <Text textStyle="sm" color="text.caption">
                  Billed monthly
                </Text>
              </Stack>

              {/* Divider */}
              <Box h="1px" bg="rgba(152,109,0,0.2)" />

              {/* Features */}
              <Stack gap="3" flex="1">
                {premiumFeatures.map((f, i) => (
                  <HStack key={i} gap="3">
                    <Box
                      flexShrink={0}
                      w="18px"
                      h="18px"
                      rounded="full"
                      bg="rgba(152,109,0,0.12)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path
                          d="M1 3.5L3.5 6L8 1"
                          stroke="#986D00"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Text textStyle="sm" color="text.secondary">
                      {f}
                    </Text>
                  </HStack>
                ))}
              </Stack>

              {/* CTA */}
              <Button
                asChild
                size="md"
                bg="primary"
                color="white"
                rounded="full"
                fontWeight="semibold"
                w="full"
                _hover={{ bg: "primary.thick" }}
                transition="background 0.2s"
              >
                <NextLink href="/signup">Upgrade to Premium</NextLink>
              </Button>
            </Box>
          </Stack>
        </Reveal>
      </Container>
    </Box>
  );
}

// ── Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <Box bg="neutral.background" minH="100vh" overflowX="hidden">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <Flex
        as="nav"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        px={{ base: "6", md: "12" }}
        py="4"
        alignItems="center"
        justifyContent="space-between"
        backdropFilter="blur(16px)"
        bg="rgba(250, 250, 249, 0.85)"
        borderBottom="1px solid"
        borderColor="stroke.transparent"
      >
        <Text
          {...domine}
          fontSize="clamp(1.4rem, 2vw, 1.75rem)"
          fontWeight="bold"
          color="primary"
        >
          Elearner
        </Text>
        <HStack gap="2em">
          <Button
            asChild
            variant="plain"
            color="text.secondary"
            fontWeight="medium"
            size="sm"
          >
            <NextLink href="#pricing">Pricing</NextLink>
          </Button>
          <Flex gap="3">
            <Button
              asChild
              variant="plain"
              color="text.secondary"
              fontWeight="medium"
              size="sm"
            >
              <NextLink href="/login">Log in</NextLink>
            </Button>
            <Button
              asChild
              size="sm"
              bg="primary"
              color="white"
              rounded="full"
              px="5"
              fontWeight="semibold"
              _hover={{ bg: "primary.thick" }}
              transition="background 0.2s"
            >
              <NextLink href="/signup">Get Started</NextLink>
            </Button>
          </Flex>
        </HStack>
      </Flex>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <Box
        position="relative"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="30%"
          left="50%"
          style={{ transform: "translate(-50%, -50%)" }}
          w={{ base: "400px", md: "800px" }}
          h={{ base: "300px", md: "500px" }}
          bg="radial-gradient(ellipse, rgba(152,109,0,0.13) 0%, transparent 68%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          top="15%"
          left="8%"
          w="380px"
          h="380px"
          bg="radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="18%"
          right="8%"
          w="320px"
          h="320px"
          bg="radial-gradient(circle, rgba(138,92,246,0.07) 0%, transparent 70%)"
          pointerEvents="none"
        />

        <Container
          maxW="4xl"
          px={{ base: "6", md: "0" }}
          textAlign="center"
          position="relative"
          zIndex={1}
        >
          <Stack gap="7" alignItems="center">
            <Stack
              textStyle="h1"
              lineHeight={1.15}
              maxW="3xl"
              style={{
                opacity: 0,
                animation:
                  "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s forwards",
              }}
            >
              <Text color="text.primary">
                Most tools help you store knowledge
              </Text>
              <Text color="primary">Elearner helps you progress</Text>
            </Stack>
            <Box
              maxW="xl"
              style={{
                opacity: 0,
                animation:
                  "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s forwards",
              }}
            >
              <Text textStyle="lg" color="text.secondary" textAlign="center">
                The problem isn’t effort. It’s not intelligence. It’s that
                you’re managing your learning manually. Elearner helps for
                systematic learning
              </Text>
            </Box>
            <Box
              style={{
                opacity: 0,
                animation:
                  "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.55s forwards",
              }}
            >
              <Button
                asChild
                size="lg"
                bg="primary"
                color="white"
                rounded="full"
                px="10"
                py="6"
                fontWeight="semibold"
                fontSize="md"
                shadow="0 4px 24px rgba(152,109,0,0.28)"
                _hover={{
                  bg: "primary.thick",
                  shadow: "0 8px 32px rgba(152,109,0,0.38)",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                <NextLink href="/signup">Get Started</NextLink>
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>

      <LearningJourneySection />

      <PricingSection />

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <Box
        position="relative"
        py={{ base: "24", md: "40" }}
        overflow="hidden"
        textAlign="center"
        bg="neutral.background"
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          style={{ transform: "translate(-50%, -50%)" }}
          w="700px"
          h="400px"
          bg="radial-gradient(ellipse, rgba(152,109,0,0.1) 0%, transparent 68%)"
          pointerEvents="none"
        />
        <Container
          maxW="2xl"
          px={{ base: "6", md: "12" }}
          position="relative"
          zIndex={1}
        >
          <Reveal>
            <Stack gap="6" alignItems="center">
              <Text textStyle="h2" color="text.primary">
                Ready to learn smarter?
              </Text>
              <Text textStyle="lg" color="text.secondary" maxW="md">
                Join learners who have simplified their study workflow and
                stopped switching between apps.
              </Text>
              <Button
                asChild
                size="lg"
                bg="primary"
                color="white"
                rounded="full"
                px="10"
                py="6"
                fontWeight="semibold"
                shadow="0 4px 24px rgba(152,109,0,0.25)"
                _hover={{
                  bg: "primary.thick",
                  shadow: "0 8px 32px rgba(152,109,0,0.35)",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                <NextLink href="/signup">Create your account</NextLink>
              </Button>
            </Stack>
          </Reveal>
        </Container>
      </Box>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Box
        bg="#1B1916"
        pt="16"
        pb="8"
        borderTop="1px solid"
        borderColor="rgba(255,255,255,0.05)"
      >
        <Container maxW="5xl" px={{ base: "6", md: "12" }}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ base: "start", md: "center" }}
            gap="10"
          >
            <Text
              {...domine}
              fontSize="clamp(1.4rem,2vw,1.75rem)"
              fontWeight="bold"
              color="#F0DFB8"
            >
              Elearner
            </Text>
            <Flex gap="2em">
              {[
                { label: "Log in", href: "/login" },
                { label: "Sign up", href: "/signup" },
              ].map((link) => (
                <Link
                  key={link.href}
                  asChild
                  textDecoration="none"
                  color="rgba(255,255,255,0.45)"
                  _hover={{ color: "rgba(255,255,255,0.85)" }}
                  transition="color 0.2s"
                >
                  <NextLink href={link.href as any}>
                    <Text textStyle="md">{link.label}</Text>
                  </NextLink>
                </Link>
              ))}
            </Flex>
          </Flex>
          <Box
            mt="12"
            pt="6"
            borderTop="1px solid"
            borderColor="rgba(255,255,255,0.05)"
          >
            <Flex
              justify={{ base: "center", md: "space-between" }}
              align="center"
              direction={{ base: "column", md: "row" }}
              gap="4"
            >
              <Text textStyle="sm" color="rgba(255,255,255,0.2)">
                © {new Date().getFullYear()} Elearner. All rights reserved.
              </Text>
              <Flex gap="6" flexWrap="wrap" justify="center">
                {[
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  {
                    label: "Terms of Service",
                    href: "/terms-of-service",
                  },
                ].map((link) => (
                  <Link
                    key={link.href}
                    asChild
                    textDecoration="none"
                    color="rgba(255,255,255,0.25)"
                    _hover={{ color: "rgba(255,255,255,0.6)" }}
                    transition="color 0.2s"
                  >
                    <NextLink href={link.href as any}>
                      <Text textStyle="sm">{link.label}</Text>
                    </NextLink>
                  </Link>
                ))}
              </Flex>
            </Flex>
          </Box>
        </Container>
      </Box>

      {/* ── All keyframes ─────────────────────────────────────── */}
      <style>{`
        /* Page animations */
        @keyframes fadeUp  { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes bounce  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(9px); } }

        /* Illustration – floating */
        @keyframes ilFloat1 { 0%,100% { transform:translateY(0);       } 50% { transform:translateY(-7px);       } }
        @keyframes ilFloat2 { 0%,100% { transform:translateY(0);       } 50% { transform:translateY(7px);        } }
        @keyframes ilFloat3 { 0%,100% { transform:translateX(-50%) translateY(0); } 50% { transform:translateX(-50%) translateY(-6px); } }

        /* Illustration – one-shot */
        @keyframes ilFadeUp     { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ilSlideLeft  { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }
        @keyframes ilSlideRight { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
        @keyframes ilPopIn      { from { opacity:0; transform:scale(0.82); } to { opacity:1; transform:scale(1); } }
        @keyframes ilPulse      { 0%,100% { transform:translate(-50%,-50%) scale(1); } 50% { transform:translate(-50%,-50%) scale(1.06); } }
        @keyframes ilProgressFill { from { width:0%; } to { width:67%; } }

        /* Context-switching illustration */
        @keyframes qPop {
          0%,100% { opacity:0; transform:translateY(0px); }
          15%     { opacity:0.88; transform:translateY(-8px); }
          50%     { opacity:0.3; transform:translateY(-18px); }
          75%     { opacity:0; transform:translateY(-24px); }
        }

        /* Sketch arrow: down on mobile, right on desktop */
        .sketch-arrow { transform: none; }
        @media (min-width: 768px) { .sketch-arrow { transform: rotate(-90deg); } }

        /* Cloud float animations */
        @keyframes cloud-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        .cloud-float-1 { animation: cloud-float 5.5s ease-in-out infinite 0s; }
        .cloud-float-2 { animation: cloud-float 6.5s ease-in-out infinite 1.2s; }
        .cloud-float-3 { animation: cloud-float 4.8s ease-in-out infinite 0.7s; }

        /* Learning journey tiles */
        @keyframes journey-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-7px); }
        }
        .journey-icon-box {
          transition: box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .journey-tile:hover .journey-icon-box {
          animation-play-state: paused;
          box-shadow: 0 14px 32px rgba(0,0,0,0.18), 0 3px 10px rgba(0,0,0,0.09) !important;
        }
      `}</style>
    </Box>
  );
}
