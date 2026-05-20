export default function GhostButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded-lg bg-transparent px-5 py-2.5 text-sm font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 active:translate-y-0 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ` + className
            }
            style={{
                color: '#1E3A5F',
                '--tw-ring-color': '#1E3A5F',
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.backgroundColor = 'rgba(30, 58, 95, 0.08)';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
            }}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
