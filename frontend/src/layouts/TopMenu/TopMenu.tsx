import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import topLogo from "../../assets/top-logo.jpeg";
import { io } from "socket.io-client";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher";
import "./TopMenu.css";

function TopMenu() {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSessions, setActiveSessions] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("activeSessions", (count: number) => setActiveSessions(count));

    return () => {
      socket.disconnect();
    };
  }, []);

  const weekdays = t("datetime.weekdays", { returnObjects: true }) as string[];
  const months = t("datetime.months", { returnObjects: true }) as string[];

  const weekday = weekdays[currentTime.getDay()];
  const day = String(currentTime.getDate()).padStart(2, "0");
  const month = months[currentTime.getMonth()];
  const year = currentTime.getFullYear();
  const timeStr = currentTime.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="top-menu">
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="top-menu__brand d-flex align-items-center">
            <img src={topLogo} alt="Inventory Logo" className="top-menu__logo" />
            <h1 className="top-menu__title">{t("top.brand")}</h1>
          </div>

          <div className="top-menu__search">
            <input
              type="text"
              className="form-control"
              placeholder={t("top.search")}
            />
          </div>

          <div className="top-menu__timer d-flex align-items-center">
            <LanguageSwitcher />

            <div
              className="active-sessions-wrapper d-flex align-items-center mx-4"
              title={t("top.sessionsTitle")}
            >
              <div className="sessions-pulse-indicator"></div>
              <span className="sessions-count fw-bold">{activeSessions}</span>
            </div>

            <div className="top-menu__date text-end">
              <div>{weekday}</div>
              <div className="text-muted">
                {day} {month}, {year}
              </div>
            </div>
            <div className="top-menu__time d-flex align-items-center ms-3">
              <span className="me-2 text-success">🕒</span>
              {timeStr}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopMenu;
