import { useTranslation } from "react-i18next";

interface StubPageProps {
  titleKey?: string;
}

function StubPage({ titleKey }: StubPageProps) {
  const { t } = useTranslation();

  return (
    <div className="container-fluid px-4 py-5">
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center"
        style={{ minHeight: "50vh" }}
      >
        <div style={{ fontSize: "64px", lineHeight: 1, marginBottom: "16px" }}>🚧</div>
        <h2 style={{ color: "#334155", fontWeight: 600 }}>
          {titleKey ? t(titleKey) : t("stub.title")}
        </h2>
        <p className="text-muted">{t("stub.text")}</p>
      </div>
    </div>
  );
}

export default StubPage;
