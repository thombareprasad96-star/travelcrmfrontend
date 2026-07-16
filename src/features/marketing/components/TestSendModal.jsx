// src/features/marketing/components/TestSendModal.jsx
// Small modal to send a single test message to a phone (WhatsApp) or email.
import { useState } from "react";
import { Beaker } from "lucide-react";
import { toast } from "@shared/ui/toast";
import { getErrorMessage, isAlreadyReported } from "@shared/api/apiError";
import { Modal, Btn, Field, inputCls } from "./marketingUi";

export default function TestSendModal({ title = "Send a test", channel, onClose, onSend }) {
  const isEmail = channel === "EMAIL";
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!to.trim()) return;
    setBusy(true);
    try {
      await onSend(to.trim());
      toast.success(`Test sent to ${to.trim()}.`);
      onClose();
    } catch (error) {
      if (!isAlreadyReported(error)) toast.error(getErrorMessage(error, "Couldn't send the test."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal icon={Beaker} title={title} subtitle={isEmail ? "Sends to one email address" : "Sends to one WhatsApp number"} maxW="max-w-md" onClose={onClose}
      footer={<>
        <Btn variant="outline" onClick={onClose}>Cancel</Btn>
        <Btn onClick={submit} disabled={busy || !to.trim()}>{busy ? "Sending…" : "Send test"}</Btn>
      </>}>
      <Field label={isEmail ? "Email address" : "WhatsApp number"} required>
        <input className={inputCls} value={to} onChange={(e) => setTo(e.target.value)}
          placeholder={isEmail ? "you@example.com" : "+91 98765 43210"} />
      </Field>
    </Modal>
  );
}