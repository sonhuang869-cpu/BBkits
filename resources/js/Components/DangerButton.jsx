export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg border border-transparent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 active:translate-y-0 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ` + className
            }
            style={{
                background: 'linear-gradient(135deg, #B91C1C 0%, #DC2626 50%, #EF4444 100%)',
                '--tw-ring-color': '#B91C1C',
            }}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
