import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import BarChartIcon from "@mui/icons-material/BarChart";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import "./App.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
const { useCallback } = React;

export type TabType =
  | "leaderboard"
  | "rivalries"
  | "conferences"
  | "head-to-head";

interface NavigationProps {
  tab: TabType;
  setTab: (tab: TabType) => void;
}

export default function Navigation({
  tab,
  setTab,
}: NavigationProps): React.ReactNode {
  const theme = useTheme();
  const onChange: (_: unknown, newTab: TabType) => void = useCallback(
    (_, newTab: TabType) => {
      setTab(newTab);
      const url = new URL(window.location.href);
      url.searchParams.set("t", newTab);
      window.history.replaceState({}, "", url);
    },
    [setTab]
  );

  const showMenu = useMediaQuery("(max-width:500px)");
  if (showMenu) {
    return (
      <BottomNavigation
        sx={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1 }}
        value={tab}
        onChange={onChange}
      >
        <BottomNavigationAction
          label="Leaderboard"
          value="leaderboard"
          icon={<BarChartIcon />}
        />
        <BottomNavigationAction
          label="Rivalries"
          value="rivalries"
          icon={<GroupIcon />}
        />
        <BottomNavigationAction
          label="Conferences"
          value="conferences"
          icon={<GroupsIcon />}
        />
        <BottomNavigationAction
          label="Head-to-head"
          value="head-to-head"
          icon={<SportsKabaddiIcon />}
        />
      </BottomNavigation>
    );
  } else {
    return (
      <Tabs
        allowScrollButtonsMobile
        variant="fullWidth"
        centered
        value={tab}
        textColor="inherit"
        onChange={onChange}
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: theme.palette.background.paper,
          width: "100%",
          zIndex: 1,
        }}
      >
        <Tab label="Leaderboard" value="leaderboard" />
        <Tab label="Rivalries" value="rivalries" />
        <Tab label="Conferences" value="conferences" />
        <Tab label="Head-to-head" value="head-to-head" />
      </Tabs>
    );
  }
}
