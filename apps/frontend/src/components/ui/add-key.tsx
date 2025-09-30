import React, { useState } from "react";
import { X } from "lucide-react";
import { useParams } from "react-router";
import { useAppDispatch } from "@/hooks/hooks";
import { addKeyRequested } from "@/state/valkey-features/keys/keyBrowserSlice";

interface AddNewKeyProps {
  onClose: () => void;
}

export default function AddNewKey({ onClose }: AddNewKeyProps) {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [keyType, setKeyType] = useState("String");
  const [keyName, setKeyName] = useState("");
  const [ttl, setTtl] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!keyName.trim()) {
      setError("Key name is required");
      return;
    }

    if (keyType === "String" && !value.trim()) {
      setError("Value is required for string type");
      return;
    }

    // Parse TTL
    const parsedTtl = ttl.trim() ? parseInt(ttl, 10) : undefined;
    if (ttl.trim() && (isNaN(parsedTtl!) || parsedTtl! < -1)) {
      setError(
        "TTL must be a valid number (-1 for no expiration, or positive number)"
      );
      return;
    }

    // Dispatch the add key action
    if (id) {
      dispatch(
        addKeyRequested({
          connectionId: id,
          key: keyName.trim(),
          value: value.trim(),
          ttl: parsedTtl && parsedTtl > 0 ? parsedTtl : undefined,
        })
      );

      // Close the modal
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="w-1/3 h-2/3 p-6 bg-white dark:bg-tw-dark-primary dark:border-tw-dark-border rounded-lg shadow-lg border flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Add Key</h2>
          <button onClick={onClose} className="hover:text-tw-primary">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex w-full justify-between gap-4">
              <div className="mt-4 text-sm font-light w-1/2">
                <div className="flex flex-col gap-2">
                  <label>Select the type of key you want to add.</label>
                  <select
                    id="key-type"
                    value={keyType}
                    onChange={(e) => setKeyType(e.target.value)}
                    className="border border-tw-dark-border rounded p-2"
                  >
                    <option disabled={true}>Pick a key type</option>
                    <option>String</option>
                    <option>Hash</option>
                    <option disabled>List (coming soon)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 text-sm font-light w-1/2">
                <div className="flex flex-col gap-2">
                  <label>TTL (seconds)</label>
                  <input
                    id="ttl"
                    type="number"
                    value={ttl}
                    onChange={(e) => setTtl(e.target.value)}
                    placeholder="Enter TTL, Default: -1 (no expiration)"
                    className="border border-tw-dark-border rounded p-2"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm font-light w-full">
              <div className="flex flex-col gap-2">
                <label>Key name *</label>
                <input
                  id="key-name"
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Enter key name"
                  className="border border-tw-dark-border rounded p-2"
                />
              </div>
            </div>
            <div className="mt-6 text-sm font-semibold border-b border-tw-dark-border pb-2">
              Key Elements
            </div>
            {keyType === "String" ? (
              <div className="mt-4 text-sm font-light w-full">
                <div className="flex flex-col gap-2">
                  <label htmlFor="value">Value *</label>
                  <textarea
                    id="value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter value"
                    className="border border-tw-dark-border rounded p-2 dark:bg-tw-dark-primary min-h-[100px]"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full justify-between gap-1">
                <div className="flex gap-4">
                  <div className="mt-4 text-sm font-light w-1/2">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        <input
                          placeholder="Field"
                          className="border border-tw-dark-border rounded p-2"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm font-light w-1/2">
                    <div className="flex flex-col gap-2">
                      <input
                        placeholder="Value"
                        className="border border-tw-dark-border rounded p-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-end h-4">
                  <button className="text-tw-primary hover:text-tw-dark-border">
                    +
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 text-sm text-red-500 font-medium">
                {error}
              </div>
            )}
          </div>

          <div className="pt-2 text-sm flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 w-full bg-tw-primary text-white rounded hover:bg-tw-primary/90"
            >
              Submit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 w-full bg-tw-primary text-white rounded hover:bg-tw-primary/90"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
