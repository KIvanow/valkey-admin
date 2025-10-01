import React, { useState } from "react";
import { Trash, X } from "lucide-react";
import { useParams } from "react-router";
import { useAppDispatch } from "@/hooks/hooks";
import { addKeyRequested } from "@/state/valkey-features/keys/keyBrowserSlice";
import { Button } from "./button";

interface AddNewKeyProps {
  onClose: () => void;
}

export default function AddNewKey({ onClose }: AddNewKeyProps) {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [keyType, setKeyType] = useState("Select key type");
  const [keyName, setKeyName] = useState("");
  const [ttl, setTtl] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [hashFields, setHashFields] = useState([{ field: "", value: "" }]);

  const addHashField =   () => {
    setHashFields([...hashFields, { field: "", value: "" }]);
  };

  const removeHashField = (index: number) => {
    setHashFields(hashFields.filter((_, i) => i !== index));
  };

  const updateHashField = (
    index: number,
    key: "field" | "value",
    val: string
  ) => {
    const updated = [...hashFields];
    updated[index][key] = val;
    setHashFields(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!keyName) {
      setError("Key name is required");
      return;
    }

    if (keyType === "Select key type") {
      setError("Please select a key type");
      return;
    }

    if (keyType === "String" && !value) {
      setError("Value is required for string type");
      return;
    }
    // Validate TTL
    const parsedTtl = ttl ? parseInt(ttl, 10) : undefined;
    if (ttl && (isNaN(parsedTtl!) || parsedTtl! < -1)) {
      setError(
        "TTL not a valid number (-1 for no expiration, or positive number)"
      );
      return;
    } else if (keyType === "Hash") {
      // this ensures at least one field-value pair is entered
      const validFields = hashFields.filter(
        (field) => field.field.trim() && field.value.trim()
      );

      if (validFields.length === 0) {
        setError("At least one field-value pair is required for hash type");
        return;
      }
    }

    // dispatching
    if (id) {
      const basePayload = {
        connectionId: id,
        key: keyName.trim(),
        keyType,
        ttl: parsedTtl && parsedTtl > 0 ? parsedTtl : undefined,
      };

      if (keyType === "String") {
        dispatch(
          addKeyRequested({
            ...basePayload,
            value: value.trim(),
          })
        );
      } else if (keyType === "Hash") {
        // before dispatching, filtering out the empty fields
        const validFields = hashFields
          .filter((field) => field.field.trim() && field.value.trim())
          .map((field) => ({
            field: field.field.trim(),
            value: field.value.trim(),
          }));

        dispatch(
          addKeyRequested({
            ...basePayload,
            fields: validFields,
          })
        );
      }

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
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col justify-between overflow-y-auto"
        >
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
                    <option disabled>Select key type</option>
                    <option>String</option>
                    <option>Hash</option>
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
            ) : keyType === "Select key type" ? (
              <div className="mt-2 text-sm font-light">Select a key type</div>
            ) : (
              <div className="flex flex-col w-full gap-2">
                {hashFields.map((field, index) => (
                  <div key={index} className="flex gap-4 items-start mt-4">
                    <div className="text-sm font-light w-1/2">
                      <input
                        placeholder="Field"
                        value={field.field}
                        onChange={(e) =>
                          updateHashField(index, "field", e.target.value)
                        }
                        className="border border-tw-dark-border rounded p-2 dark:bg-tw-dark-primary w-full"
                      />
                    </div>
                    <div className="text-sm font-light w-1/2">
                      <input
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) =>
                          updateHashField(index, "value", e.target.value)
                        }
                        className="border border-tw-dark-border rounded p-2 dark:bg-tw-dark-primary w-full"
                      />
                    </div>
                    {hashFields.length > 1 && (
                      <Button
                        variant={"destructiveGhost"}
                        onClick={() => removeHashField(index)}
                        className="mt-1"
                      >
                        <Trash size={14} />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="text-end">
                  <button
                    type="button"
                    onClick={addHashField}
                    className="text-tw-primary hover:text-tw-dark-border font-light text-sm"
                  >
                    + Add Field
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
              disabled={keyType === "Select key type" || !keyName}
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
