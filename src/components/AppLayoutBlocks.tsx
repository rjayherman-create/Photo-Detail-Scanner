import React from "react";

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="page-heading">
      {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
      <h2 className="page-title">{title}</h2>
      {description ? <p className="page-description">{description}</p> : null}
    </section>
  );
}

export function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card">
      {title ? <h3 className="card-title">{title}</h3> : null}
      {children}
    </section>
  );
}

export function WorkflowCard({
  step,
  title,
  description,
  status,
  statusType = "neutral",
  children,
}: {
  step: number | string;
  title: string;
  description?: string;
  status?: string;
  statusType?: "done" | "alert" | "warning" | "neutral";
  children?: React.ReactNode;
}) {
  return (
    <section className="workflow-card">
      <div className="workflow-topline">
        <div className="workflow-left">
          <div className="workflow-step">{step}</div>

          <div className="workflow-content">
            <h3 className="workflow-title">{title}</h3>
            {description ? <p className="workflow-description">{description}</p> : null}
          </div>
        </div>

        {status ? (
          <span className={`workflow-status ${statusType}`}>{status}</span>
        ) : null}
      </div>

      {children}
    </section>
  );
}

export function FormCard({ children }: { children: React.ReactNode }) {
  return <section className="form-card">{children}</section>;
}

export function ButtonRow({ children }: { children: React.ReactNode }) {
  return <div className="button-row">{children}</div>;
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="table-wrap">{children}</div>;
}

export function MobileList({ children }: { children: React.ReactNode }) {
  return <div className="mobile-list">{children}</div>;
}

export function MobileListItem({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mobile-list-item">
      <p className="mobile-list-title">{title}</p>
      {meta ? <p className="mobile-list-meta">{meta}</p> : null}
      {children}
    </div>
  );
}
