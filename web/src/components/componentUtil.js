import "../App.scss";

export function PanelHeader(props) {
    return (
        <div className="header shadow">
            <span>{props.title}</span>
        </div>
    );
}

export default PanelHeader;
