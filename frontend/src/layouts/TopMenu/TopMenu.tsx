import { useEffect, useState } from "react";
import topLogo from "../../assets/top-logo.jpeg";
import "./TopMenu.css";

function TopMenu() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const MONTHS_RU = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ];

  const weekday = currentTime.toLocaleDateString("ru-RU", { weekday: "long" });
  const day = String(currentTime.getDate()).padStart(2, "0");
  const month = MONTHS_RU[currentTime.getMonth()];
  const year = currentTime.getFullYear();
  const timeStr = currentTime.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="top-menu">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <div className="top-menu__brand d-flex align-items-center">
            <img
              src={topLogo}
              alt="Inventory Logo"
              className="top-menu__logo"
            />
            <h1 className="top-menu__title">INVENTORY</h1>
          </div>

          <div className="top-menu__search">
            <input type="text" className="form-control" placeholder="Поиск" />
          </div>

          <div className="top-menu__timer d-flex align-items-center">
            <div className="top-menu__date text-end">
              <div>{weekday}</div>
              <div className="text-muted">
                {day} {month}, {year}
              </div>
            </div>
            <div className="top-menu__time d-flex align-items-center">
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
