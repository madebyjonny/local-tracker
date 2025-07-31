function Dialog({
  children,
  title,
  buttonLabel = "Submit",
  formName = "dialog-form",
  ref,
}: {
  ref?: React.RefObject<HTMLDialogElement | null>;
  children?: React.ReactNode;
  title: string;
  formName?: string;
  buttonLabel?: string;
}) {
  const handleClose = () => {
    if (ref?.current) {
      ref.current.close();
    }
  };

  return (
    <dialog className="dialog" ref={ref}>
      <header>
        <h2>{title}</h2>
      </header>
      <main>{children}</main>
      <footer>
        <button type="button" onClick={handleClose}>
          Close
        </button>
        <button type="submit" form={formName} className="solid">
          {buttonLabel}
        </button>
      </footer>
    </dialog>
  );
}

export default Dialog;
