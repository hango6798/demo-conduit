import { Nav } from "react-bootstrap";
import "./style.scss";
import { Tab } from "models";

interface Props {
  listTabs: {
    name: string;
    hide: boolean;
    disabled: boolean;
    content: string;
  }[];
  handleTabClick: (tab: Tab) => void;
  currentTab: Tab;
}

export const Tabs = ({ listTabs, handleTabClick, currentTab }: Props) => {
  const setActive = (tab: Tab) => {
    return tab === currentTab;
  };
  return (
    <Nav variant="pills" className="border-0 tabs mb-3 d-flex text-center">
      {listTabs.map((tab: any) => {
        return (
          <Nav.Item key={tab.name} hidden={tab.hide}>
            <Nav.Link
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.name)}
              active={setActive(tab.name)}
            >
              {tab.content}
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};
