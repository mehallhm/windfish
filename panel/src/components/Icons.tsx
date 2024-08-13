import { JSX } from "solid-js";

interface IconProps {
  class: string;
  stroke?: string;
}

function IconWrapper(props: {
  class: string;
  stroke?: string;
  children: JSX.Element;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={props?.stroke ? props.stroke : "2"}
      stroke-linecap="round"
      stroke-linejoin="round"
      class={props.class}
    >
      {props.children}
    </svg>
  );
}

export function StackIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 4l-8 4l8 4l8 -4l-8 -4" />
      <path d="M4 12l8 4l8 -4" />
      <path d="M4 16l8 4l8 -4" />
    </IconWrapper>
  );
}

export function NetworkIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0" />
      <path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6" />
      <path d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6" />
      <path d="M6 9h12" />
      <path d="M3 20h7" />
      <path d="M14 20h7" />
      <path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M12 15v3" />
    </IconWrapper>
  );
}

export function DriveIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 21h10a2 2 0 0 0 2 -2v-14a2 2 0 0 0 -2 -2h-6.172a2 2 0 0 0 -1.414 .586l-3.828 3.828a2 2 0 0 0 -.586 1.414v10.172a2 2 0 0 0 2 2z" />
      <path d="M13 6v2" />
      <path d="M16 6v2" />
      <path d="M10 7v1" />
    </IconWrapper>
  );
}

export function CubeIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
      <path d="M12 12l8 -4.5" />
      <path d="M12 12l0 9" />
      <path d="M12 12l-8 -4.5" />
    </IconWrapper>
  );
}

export function HexagonQuestionIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
      <path d="M12 16v.01" />
      <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
    </IconWrapper>
  );
}

export function FishIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16.69 7.44a6.973 6.973 0 0 0 -1.69 4.56c0 1.747 .64 3.345 1.699 4.571" />
      <path d="M2 9.504c7.715 8.647 14.75 10.265 20 2.498c-5.25 -7.761 -12.285 -6.142 -20 2.504" />
      <path d="M18 11v.01" />
      <path d="M11.5 10.5c-.667 1 -.667 2 0 3" />
    </IconWrapper>
  );
}

export function LogsIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 12h.01" />
      <path d="M4 6h.01" />
      <path d="M4 18h.01" />
      <path d="M8 18h2" />
      <path d="M8 12h2" />
      <path d="M8 6h2" />
      <path d="M14 6h6" />
      <path d="M14 12h6" />
      <path d="M14 18h6" />
    </IconWrapper>
  );
}

export function BracesIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 4a2 2 0 0 0 -2 2v3a2 3 0 0 1 -2 3a2 3 0 0 1 2 3v3a2 2 0 0 0 2 2" />
      <path d="M17 4a2 2 0 0 1 2 2v3a2 3 0 0 0 2 3a2 3 0 0 0 -2 3v3a2 2 0 0 1 -2 2" />
    </IconWrapper>
  );
}

export function BinocularsIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M17 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M16.346 9.17l-.729 -1.261c-.16 -.248 -1.056 -.203 -1.117 .091l-.177 1.38" />
      <path d="M19.761 14.813l-2.84 -5.133c-.189 -.31 -.592 -.68 -1.421 -.68c-.828 0 -1.5 .448 -1.5 1v6" />
      <path d="M7.654 9.17l.729 -1.261c.16 -.249 1.056 -.203 1.117 .091l.177 1.38" />
      <path d="M4.239 14.813l2.84 -5.133c.189 -.31 .592 -.68 1.421 -.68c.828 0 1.5 .448 1.5 1v6" />
      <rect width="4" height="2" x="10" y="12" />
    </IconWrapper>
  );
}

export function GaugeIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M13.41 10.59l2.59 -2.59" />
      <path d="M7 12a5 5 0 0 1 5 -5" />
    </IconWrapper>
  );
}
