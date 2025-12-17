export const blockNoteStyle = {
  // heading block
  '[data-content-type="heading"]': {
    textStyle: "h2 !important",
  },
  '[data-content-type="heading"][data-level="2"]': {
    textStyle: "h3 !important",
  },
  '[data-content-type="heading"][data-level="3"]': {
    textStyle: "h4 !important",
  },
  '[data-content-type="heading"][data-level="4"]': {
    textStyle: "h5 !important",
  },
  // checklist item block
  '[data-content-type="checkListItem"]': {
    alignItems: "center",
  },
  '[data-content-type="checkListItem"] input': {
    appearance: "none",
    bg: "stroke.thick",
    w: "1rem !important",
    h: "1rem !important",
    borderRadius: "2px",
    display: "inline-grid",
    alignItems: "center",
    justifyContent: "center",
  },
  '[data-content-type="checkListItem"] input:before': {
    content: '""',
    transform: "scale(0)",
    bg: "white",
    clipPath: "polygon(14% 44%, 0 65%, 34% 80%, 100% 18%, 85% 0, 34% 60%)",
    w: "0.5rem",
    h: "0.5rem",
  },
  '[data-content-type="checkListItem"] input:checked:before': {
    transform: "scale(1)",
  },
  '[data-content-type="checkListItem"] p': {
    color: "text.secondary",
    fontWeight: "medium",
  },
  '[data-content-type="checkListItem"][data-checked="true"] p': {
    color: "text.caption",
    textDecoration: "none !important",
  },
};
