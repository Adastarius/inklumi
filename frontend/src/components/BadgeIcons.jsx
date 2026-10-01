const base = {
    width: 28,
    height: 28,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    focusable: 'false',
}
 
export const ElevatorIcon = () => (
    <svg {...base}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M10 9l2-3 2 3" /><path d="M10 15l2 3 2-3" /></svg>
)
 
export const ParkingIcon = () => (
    <svg {...base}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></svg>
)
 
export const DoorIcon = () => (
    <svg {...base}><rect x="5" y="3" width="12" height="18" rx="1" /><circle cx="14" cy="12" r="0.8" fill="currentColor" /><path d="M17 3v18" strokeDasharray="2 3" /></svg>
)
 
export const BrailleIcon = () => (
    <svg {...base}>
        <circle cx="7" cy="6" r="1.4" fill="currentColor" /><circle cx="12" cy="6" r="1.4" fill="currentColor" opacity="0.25" />
        <circle cx="7" cy="12" r="1.4" fill="currentColor" /><circle cx="12" cy="12" r="1.4" fill="currentColor" />
        <circle cx="7" cy="18" r="1.4" fill="currentColor" opacity="0.25" /><circle cx="12" cy="18" r="1.4" fill="currentColor" />
    </svg>
)
 
export const AudioIcon = () => (
    <svg {...base}><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><rect x="2" y="14" width="5" height="6" rx="1.5" /><rect x="17" y="14" width="5" height="6" rx="1.5" /></svg>
)
 
export const VideoIcon = () => (
    <svg {...base}><rect x="2" y="5" width="14" height="14" rx="2" /><path d="M16 10l6-3v10l-6-3" /></svg>
)
 
export const SignpostIcon = () => (
    <svg {...base}><path d="M12 21V9" /><path d="M12 9l-8 2v-4l8-2" /><path d="M12 9l9 2v-4l-9-2" /></svg>
)
 
export const TactileIcon = () => (
    <svg {...base}><path d="M4 20c2-6 2-10 0-16" strokeDasharray="1 3.2" /><path d="M20 20c-2-6-2-10 0-16" strokeDasharray="1 3.2" /><path d="M9 4h6M9 20h6" /></svg>
)
 
export const ContrastIcon = () => (
    <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" /></svg>
)
 
export const InductionLoopIcon = () => (
    <svg {...base}><path d="M8 21a8 8 0 1 1 8 0" /><path d="M9 14a3 3 0 1 1 6 0" /></svg>
)
 
export const SignLanguageIcon = () => (
    <svg {...base}><path d="M8 13V6a1.5 1.5 0 0 1 3 0v5" /><path d="M11 11V4a1.5 1.5 0 0 1 3 0v7" /><path d="M14 11V5.5a1.5 1.5 0 0 1 3 0V13" /><path d="M8 13c0-1-2-1.5-2 .5 0 4 2 8 6 8s6-3 6-6v-3" /></svg>
)
 
export const SubtitlesIcon = () => (
    <svg {...base}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M6 14h4" /><path d="M13 14h5" /><path d="M6 10.5h11" /></svg>
)
 
export const AlarmIcon = () => (
    <svg {...base}><path d="M9 18a3 3 0 0 0 6 0" /><path d="M6 14c0-4 1.5-7 6-7s6 3 6 7l1.5 3h-15Z" /><path d="M3 3l3 3M21 3l-3 3" /></svg>
)
 
export const EasyLanguageIcon = () => (
    <svg {...base}><path d="M4 5h16" /><path d="M4 10h10" /><path d="M4 15h16" /><path d="M4 20h7" /></svg>
)
 
export const QuietHoursIcon = () => (
    <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
 
export const LowCrowdIcon = () => (
    <svg {...base}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-4 2.5-6 6-6s6 2 6 6" /><circle cx="18" cy="9" r="2" opacity="0.35" /><path d="M15 20c0-2.8 1.3-4.5 3-5.2" opacity="0.35" /></svg>
)
 
// Icons für den "So nutzt du die Seite"-Ablauf
export const SearchIcon = () => (
    <svg {...base}><circle cx="10" cy="10" r="6" /><path d="M20 20l-5.5-5.5" /></svg>
)
 
export const ChecklistIcon = () => (
    <svg {...base}><path d="M4 6h4M4 12h4M4 18h4" /><path d="M11 6h9M11 12h9M11 18h9" /><path d="M4 6l1-1M4 12l1-1M4 18l1-1" /></svg>
)
 
export const PhoneIcon = () => (
    <svg {...base}><path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2C10.5 19 5 13.5 5 6a2 2 0 0 1 1-3Z" /></svg>
)
 
export const EditIcon = () => (
    <svg {...base}><path d="M4 20l1-4 11-11 3 3-11 11-4 1Z" /><path d="M14 6l3 3" /></svg>
)
