export default function AccentButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg border border-transparent px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 active:translate-y-0 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ` + className
            }
            style={{
                background: 'linear-gradient(135deg, #B8956A 0%, #D4A574 50%, #E8C4A0 100%)',
                color: '#1E3A5F',
                '--tw-ring-color': '#D4A574',
            }}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
