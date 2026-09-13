export default function Racehorse({ silk, coat }: { silk: string; coat: string }) {
    return (
        <svg viewBox="0 0 88 64" width="88" height="64" fill="none" shapeRendering="crispEdges">
            <g>
                <path d="M18 33H10V37H6V45H2V49H10V45H14V41H22Z" fill="#302a25" />
                <g>
                    <path d="M23 42H33V50H25V57H17V60H10V55H18V48H23Z" fill={coat} />
                    <path d="M10 55H18V60H10Z" fill="#292920" />
                </g>
                <g>
                    <path d="M50 41H60V48H68V53H74V58H66V54H58V49H50Z" fill={coat} />
                    <path d="M66 54H74V59H66Z" fill="#292920" />
                </g>
                <path d="M19 31H50V27H57V17H63V11H67V17H75V23H82V31H74V34H67V30H64V39H59V46H24V42H18Z" fill={coat} />
                <path d="M55 23H59V16H64V12H67V18H63V26H60V34H55Z" fill="#302a25" />
                <path d="M76 25H80V29H76Z" fill="#ece1c3" />
                <path d="M70 20H73V23H70Z" fill="#131f19" />
                <path d="M32 32H51V41H32Z" fill={silk} />
                <path d="M39 34H43V39H39Z" fill="white" />
                <path d="M35 24H45V30H51V34H44V31H35Z" fill="#f4ede0" />
                <path d="M39 13H49V18H56V23H52V27H43V24H36V19H39Z" fill={silk} />
                <path d="M49 21H55V25H62V28H60V30H53V27H48Z" fill="#f0c6a0" />
                <path d="M48 7H56V15H48Z" fill="#f0c6a0" />
                <path d="M46 6H56V9H60V12H46Z" fill={silk} />
                <path d="M49 28H62V30H49Z" fill="#302a25" />
            </g>
        </svg>
    )
}

