import $ from './style.module.scss'

type Props = {
    text:string;
}

function Header({text}:Props) {
    return(
        <div className={$.header}>
            {text}
        </div>
    )
}

export default Header;
