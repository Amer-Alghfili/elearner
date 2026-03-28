"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { domine } from "@/fonts";
import { useEffect, useRef, useState } from "react";
import { FaDiscord } from "react-icons/fa6";

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

function ContextSwitchingIllustration() {
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
      {/* Notes window – top left, floats up */}
      <MockWindow
        color="blue"
        title="Notes App"
        rows={3}
        style={{
          position: "absolute",
          top: 18,
          left: 14,
          width: 138,
          animation: "ilFloat1 4s ease-in-out infinite",
        }}
      />
      {/* Bookmarks – top right, floats down */}
      <MockWindow
        color="amber"
        title="Bookmarks"
        rows={3}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 124,
          animation: "ilFloat2 5s ease-in-out infinite",
        }}
      />
      {/* Flashcards – bottom center, floats up */}
      <MockWindow
        color="purple"
        title="Flashcards App"
        rows={2}
        style={{
          position: "absolute",
          bottom: 18,
          left: "50%",
          transform: "translateX(-50%)",
          width: 148,
          animation: "ilFloat3 4.5s ease-in-out infinite 0.6s",
        }}
      />
      {/* Centre chaos badge */}
      <div
        style={{
          position: "absolute",
          top: "46%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(220,38,38,0.92)",
          color: "white",
          borderRadius: 99,
          padding: "5px 12px",
          fontSize: 10,
          fontWeight: 800,
          boxShadow: "0 4px 14px rgba(220,38,38,0.45)",
          animation: "ilPulse 2.2s ease-in-out infinite",
          whiteSpace: "nowrap",
          zIndex: 10,
        }}
      >
        😤 3 different apps open
      </div>
    </div>
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
                width: 1.5,
                height: 1.5,
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
}: {
  painTitle: string;
  painBullets: string[];
  painIllustrationKey: IllustrationKey;
  solutionTitle: string;
  solutionBullets: string[];
  solutionIllustrationKey: IllustrationKey;
  delay?: number;
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
        <Flex direction={{ base: "column", md: "row" }} align="stretch">
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
                The Problem
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
              h={{ base: "200px", md: "220px" }}
              rounded="xl"
              overflow="hidden"
              mt="auto"
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
              {/* Sweeping curved arrow — down on mobile, right on desktop */}
              <Box display={{ base: "none", md: "block" }}>
                <svg
                  width="100"
                  height="54"
                  viewBox="0 0 100 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 33 C10 55, 38 -1, 50 33 C62 53, 84 33, 95 33"
                    stroke="#B8B0A8"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    opacity="0.3"
                    fill="none"
                  />
                  <path
                    d="M89 27 L95 33 L89 39"
                    stroke="#B8B0A8"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    opacity="0.3"
                    fill="none"
                  />

                  <path
                    d="M5 27 C10 49, 38 -7, 50 27 C62 47, 84 27, 95 27"
                    stroke="#B8B0A8"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    fill="none"
                  />
                  <path
                    d="M89 21 L95 27 L89 33"
                    stroke="#B8B0A8"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                  />
                </svg>
              </Box>
              <Box display={{ base: "block", md: "none" }}>
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
        </Flex>
      </Box>
    </Reveal>
  );
}

// ── Data ─────────────────────────────────────────────────────────────
const combinedCards: {
  painTitle: string;
  painBullets: string[];
  painIllustrationKey: IllustrationKey;
  solutionTitle: string;
  solutionBullets: string[];
  solutionIllustrationKey: IllustrationKey;
}[] = [
  {
    painTitle: "Context Switching",
    painBullets: [
      "How many platforms are you currently using?",
      "Separate apps for bookmarks, note-taking, and flashcards — all fragmented",
      "Every tool solves a learning problem, yet nothing talks to each other",
    ],
    painIllustrationKey: "ContextSwitching",
    solutionTitle: "One Platform, One Solution!",
    solutionBullets: [
      'Organized around "learns" — topics you want to master',
      "Notes, flashcards, and resources bundled in a single container",
      "All your daily learning tasks live on one page — no tab juggling",
    ],
    solutionIllustrationKey: "OnePlatform",
  },
  {
    painTitle: "Bookmarking Resources",
    painBullets: [
      "Where do you store links for a complex topic you're studying?",
      "Browser bookmarks aren't built for learning — they're for frequently visited sites",
      "Resources buried in nested folders get abandoned and forgotten",
    ],
    painIllustrationKey: "BookmarkingPain",
    solutionTitle: "Resources Tied to Your Learn",
    solutionBullets: [
      "Every learn has its own dedicated bookmark list",
      "No separate folders or apps — resources are tied directly to the topic",
      "Open any learn and your resources are immediately front and center",
    ],
    solutionIllustrationKey: "TiedResources",
  },
  {
    painTitle: "Reviewing What You've Learnt",
    painBullets: [
      "Highlighting a quote doesn't mean you know it — that's passive, not active learning",
      "Once you grasp a topic, there's no convenient way to review it later",
      "Barely any app combines notes and flashcards — you're forced to switch tools",
    ],
    painIllustrationKey: "ReviewingPain",
    solutionTitle: "Add Flashcards Without Leaving Your Notebook!",
    solutionBullets: [
      "Create a flashcard without ever closing your notes",
      "Spaced repetition keeps you actively engaged, not just passively reading",
      "Each learn has its own isolated flashcard set — no mixing between topics",
    ],
    solutionIllustrationKey: "Flashcards",
  },
];

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
        <HStack gap="3">
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
            <NextLink href="/signup">Get started free</NextLink>
          </Button>
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
          px={{ base: "6", md: "12" }}
          textAlign="center"
          position="relative"
          zIndex={1}
        >
          <Stack gap="7" alignItems="center">
            <Box
              px="4"
              py="1.5"
              rounded="full"
              bg="primary.transparent"
              border="1px solid"
              borderColor="rgba(152,109,0,0.28)"
              style={{
                opacity: 0,
                animation:
                  "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s forwards",
              }}
            >
              <Text textStyle="sm-semibold" color="primary.thick">
                Your all-in-one learning companion
              </Text>
            </Box>
            <Box
              style={{
                opacity: 0,
                animation:
                  "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s forwards",
              }}
            >
              <Text
                textStyle="h1"
                color="text.primary"
                lineHeight={1.15}
                maxW="3xl"
              >
                All of your learning problems,{" "}
                <Box as="span" color="primary">
                  solved in one place
                </Box>
              </Text>
            </Box>
            <Box
              maxW="xl"
              style={{
                opacity: 0,
                animation:
                  "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s forwards",
              }}
            >
              <Text textStyle="lg" color="text.secondary" textAlign="center">
                Stop juggling apps. Keep your notes, bookmarks, and flashcards
                together — exactly where your learning happens.
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
                <NextLink href="/signup">Get started for free</NextLink>
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* ── Problems & Solutions ─────────────────────────────── */}
      <Box
        position="relative"
        py={{ base: "16", md: "24" }}
        overflow="hidden"
        bg="neutral.background"
      >
        <Box
          position="absolute"
          top="0"
          left="50%"
          style={{ transform: "translateX(-50%)" }}
          w="1100px"
          h="800px"
          bg="radial-gradient(ellipse, rgba(152,109,0,0.05) 0%, transparent 70%)"
          pointerEvents="none"
        />
        <Container
          maxW="5xl"
          px={{ base: "6", md: "12" }}
          position="relative"
          zIndex={1}
        >
          <Stack gap="6">
            {combinedCards.map((card, i) => (
              <CombinedFeatureCard
                key={card.painTitle}
                {...card}
                delay={i * 100}
              />
            ))}
          </Stack>
        </Container>
      </Box>

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
                <NextLink href="/signup">Create your free account</NextLink>
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
            alignItems={{ base: "start", md: "start" }}
            gap="10"
          >
            <Stack gap="3" maxW="xs">
              <Text
                {...domine}
                fontSize="clamp(1.4rem,2vw,1.75rem)"
                fontWeight="bold"
                color="#F0DFB8"
              >
                Elearner
              </Text>
              <Text
                textStyle="sm"
                color="rgba(255,255,255,0.38)"
                lineHeight={1.6}
              >
                Notes, bookmarks, and flashcards — all in one place, organized
                around what you&apos;re learning.
              </Text>
            </Stack>
            <Link
              href="https://discord.gg/elearner"
              target="_blank"
              rel="noopener noreferrer"
              textDecoration="none"
              display="flex"
              alignItems="center"
              gap="3"
              px="5"
              py="3.5"
              rounded="xl"
              bg="rgba(88,101,242,0.12)"
              border="1px solid"
              borderColor="rgba(88,101,242,0.28)"
              _hover={{
                bg: "rgba(88,101,242,0.22)",
                transform: "translateY(-2px)",
                borderColor: "rgba(88,101,242,0.45)",
              }}
              transition="all 0.2s"
              alignSelf={{ base: "start", md: "center" }}
            >
              <FaDiscord size={24} color="#7289da" />
              <Stack gap="0.5">
                <Text textStyle="sm-semibold" color="white">
                  Join our Discord
                </Text>
                <Text textStyle="sm" color="rgba(255,255,255,0.38)">
                  Ask questions &amp; share resources
                </Text>
              </Stack>
            </Link>
            <Stack gap="3">
              <Text
                textStyle="sm-semibold"
                color="rgba(255,255,255,0.35)"
                textTransform="uppercase"
                letterSpacing="0.08em"
              >
                Quick links
              </Text>
              <Stack gap="2">
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
                    <NextLink href={link.href}>
                      <Text textStyle="md">{link.label}</Text>
                    </NextLink>
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Flex>
          <Box
            mt="12"
            pt="6"
            borderTop="1px solid"
            borderColor="rgba(255,255,255,0.05)"
            textAlign="center"
          >
            <Text textStyle="sm" color="rgba(255,255,255,0.2)">
              © {new Date().getFullYear()} Elearner. All rights reserved.
            </Text>
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

        /* Sketch arrow: down on mobile, right on desktop */
        .sketch-arrow { transform: none; }
        @media (min-width: 768px) { .sketch-arrow { transform: rotate(-90deg); } }
      `}</style>
    </Box>
  );
}
