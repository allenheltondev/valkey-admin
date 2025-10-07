import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import * as R from "ramda"
import { useParams } from "react-router"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { convertTTL } from "@common/src/ttl-conversion"
import { formatBytes } from "@common/src/bytes-conversion"
import { calculateTotalMemoryUsage } from "@common/src/memory-usage-calculation"
import {
  Compass,
  RefreshCcw,
  Key,
  Hourglass,
  Database,
  Trash,
  Pencil,
  X,
  Check
} from "lucide-react"
import { CustomTooltip } from "./ui/custom-tooltip"
import { AppHeader } from "./ui/app-header"
import AddNewKey from "./ui/add-key"
import { Button } from "./ui/button"
import DeleteModal from "./ui/delete-modal"
import { useAppDispatch } from "@/hooks/hooks"
import {
  selectKeys,
  selectLoading,
  selectError
} from "@/state/valkey-features/keys/keyBrowserSelectors"
import {
  getKeysRequested,
  getKeyTypeRequested,
  deleteKeyRequested,
  updateKeyRequested
} from "@/state/valkey-features/keys/keyBrowserSlice"

interface KeyInfo {
  name: string;
  type: string;
  ttl: number;
  size: number;
  collectionSize?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elements?: any;
}

interface ElementInfo {
  key: string;
  value: string;
}

export function KeyBrowser() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [editedValue, setEditedValue] = useState("")
  const [editedHashValue, setEditedHashValue] = useState<{ [key: string]: string }>({})

  const handleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  const handleAddKeyModal = () => {
    setIsAddKeyOpen(!isAddKeyOpen)
  }

  const keys: KeyInfo[] = useSelector(selectKeys(id!))
  const loading = useSelector(selectLoading(id!))
  const error = useSelector(selectError(id!))

  useEffect(() => {
    if (id) {
      dispatch(getKeysRequested({ connectionId: id! }))
    }
  }, [id, dispatch])

  const handleRefresh = () => {
    dispatch(getKeysRequested({ connectionId: id! }))
  }

  const handleEdit = () => {
    if (isEditable) {
      // Cancel edit - reset to original value
      setIsEditable(false)
      setEditedValue("")
    } else {
      // Start editing - initialize with current value
      if (selectedKeyInfo?.type === "string") {
        setEditedValue(selectedKeyInfo.elements)
      } else if (selectedKeyInfo?.type === "hash") {
        const initialHashValue: { [key: string]: string } = {}
        selectedKeyInfo.elements.forEach((element: ElementInfo) => {
          initialHashValue[element.key] = element.value
        })
        setEditedHashValue(initialHashValue)
      }
      setIsEditable(true)
    }
  }

  const handleSave = () => {
    if (selectedKey && id && selectedKeyInfo) {
      if (selectedKeyInfo.type === "string") {
        dispatch(updateKeyRequested({
          connectionId: id,
          key: selectedKey,
          keyType: "string",
          value: editedValue,
        }))
      } else if (selectedKeyInfo.type === "hash") {
        dispatch(updateKeyRequested({
          connectionId: id,
          key: selectedKey,
          keyType: "hash",
          fields: Object.entries(editedHashValue).map(([field, value]) => ({
            field,
            value
          })),
        }))
      }
      setIsEditable(false)
      setEditedValue("")
      setEditedHashValue({})
    }
  }

  const handleHashFieldChange = (fieldKey: string, newValue: string) => {
    setEditedHashValue(prev => ({
      ...prev,
      [fieldKey]: newValue
    }))
  }

  const handleKeyClick = (keyName: string) => {
    setSelectedKey(keyName)

    const keyInfo = keys.find((k) => k.name === keyName)
    if (R.isNotEmpty(keyInfo) && !keyInfo!.type) {
      dispatch(getKeyTypeRequested({ connectionId: id!, key: keyName }))
    }
  }

  const handleKeyDelete = (keyName: string) => {
    dispatch(deleteKeyRequested({ connectionId: id!, key: keyName }))
    setSelectedKey(null)
    handleDeleteModal()
  }

  // Get selected key info from the keys data
  const selectedKeyInfo = selectedKey
    ? keys.find((k) => k.name === selectedKey)
    : null

  // Calculate total memory usage
  const totalMemoryUsage = calculateTotalMemoryUsage(keys)

  return (
    <div className="flex flex-col h-screen p-4">
      <AppHeader icon={<Compass size={20} />} title="Key Browser" />

      {loading && <div className="ml-2">Loading keys...</div>}
      {error && <div className="ml-2">Error loading keys: {error}</div>}

      {/* Total Keys and Key Stats */}
      <div className="flex justify-between mb-8">
        <div className="h-20 w-1/4 p-4 dark:border-tw-dark-border border rounded flex flex-col justify-center items-center">
          <span className="text-2xl font-semibold">{keys.length}</span>
          <span className="font-light text-sm">Total Keys</span>
        </div>
        <div className="h-20 w-1/4 p-4 dark:border-tw-dark-border border rounded flex flex-col justify-center items-center">
          <span className="text-2xl font-semibold">
            {formatBytes(totalMemoryUsage)}
          </span>
          <span className="font-light text-sm">Memory Usage</span>
        </div>
        <div className="h-20 w-1/4 p-4 dark:border-tw-dark-border border rounded flex flex-col justify-center items-center">
          <span className="text-2xl font-semibold">TBD</span>
          <span className="font-light text-sm">Operations</span>
        </div>
        <div className="h-20 w-1/5 p-4 dark:border-tw-dark-border border rounded flex flex-col justify-center items-center">
          <span className="text-2xl font-semibold">TBD</span>
          <span className="font-light text-sm">Hit Rate</span>
        </div>
      </div>

      {/* Search and Refresh */}
      <div className="flex items-center w-full mb-4 text-sm font-light">
        <input
          className="flex-1 h-10 p-2 dark:border-tw-dark-border border rounded"
          placeholder="search"
        />
        <button
          className="h-10 ml-2 px-4 py-2 bg-tw-primary text-white rounded "
          onClick={handleAddKeyModal}
        >
          + Add Key
        </button>
        <button
          className="h-10 ml-2 px-4 py-2 bg-tw-primary text-white rounded"
          onClick={handleRefresh}
        >
          <RefreshCcw />
        </button>
      </div>

      {/* Add Key Modal */}
      {isAddKeyOpen && <AddNewKey onClose={handleAddKeyModal} />}

      {/* Key Viewer */}
      <TooltipProvider>
        <div className="flex flex-1 min-h-0">
          {/* Keys List */}
          <div className="w-1/2 pr-2">
            {keys.length === 0 ? (
              <div className="h-full p-2 dark:border-tw-dark-border border rounded flex items-center justify-center">
                No keys found
              </div>
            ) : (
              <div className="h-full dark:border-tw-dark-border border rounded overflow-hidden">
                <ul className="h-full overflow-y-auto space-y-2 p-2">
                  {keys.map((keyInfo: KeyInfo, index) => (
                    <li
                      className="h-16 p-2 dark:border-tw-dark-border border hover:text-tw-primary 
                      cursor-pointer rounded flex items-center gap-2 justify-between"
                      key={index}
                      onClick={() => handleKeyClick(keyInfo.name)}
                    >
                      <div className=" items-center gap-2">
                        <span className="flex items-center gap-2">
                          <Key size={16} /> {keyInfo.name}
                        </span>
                        <div className="ml-6 text-xs font-light text-tw-primary">
                          {R.toUpper(keyInfo.type)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {keyInfo.size && (
                          <CustomTooltip content="Size">
                            <span
                              className="flex items-center justify-between gap-1 text-xs px-2 py-1 
                            rounded-full border-2 border-tw-primary text-tw-primary dark:text-white"
                            >
                              <Database
                                className="text-white bg-tw-primary p-1 rounded-full"
                                size={20}
                              />{" "}
                              {formatBytes(keyInfo.size)}
                            </span>
                          </CustomTooltip>
                        )}
                        {/* text-red-400 is a placehodler for now, will change to a custom tw color */}
                        <CustomTooltip content="TTL">
                          <span
                            className="flex items-center justify-between gap-1 text-xs px-2 py-1 
                          rounded-full border-2 border-tw-primary text-tw-primary dark:text-white"
                          >
                            <Hourglass
                              className="text-white bg-tw-primary p-1 rounded-full"
                              size={20}
                            />{" "}
                            {convertTTL(keyInfo.ttl)}
                          </span>
                        </CustomTooltip>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Key Details */}
          <div className="w-1/2 pl-2">
            <div className="h-full dark:border-tw-dark-border border rounded overflow-hidden">
              {selectedKey && selectedKeyInfo ? (
                <div className="h-full p-4 text-sm font-light overflow-y-auto">
                  <div className="flex justify-between items-center mb-2 border-b pb-4 border-tw-dark-border">
                    <span className="font-semibold flex items-center gap-2">
                      <Key size={16} />
                      {selectedKey}
                    </span>
                    <div className="space-x-2 flex items-center relative">
                      <CustomTooltip content="TTL">
                        <span className="text-xs px-2 py-1 rounded-full border-2 border-tw-primary text-tw-primary dark:text-white">
                          {convertTTL(selectedKeyInfo.ttl)}
                        </span>
                      </CustomTooltip>
                      <CustomTooltip content="Type">
                        <span className="text-xs px-2 py-1 rounded-full border-2 border-tw-primary text-tw-primary dark:text-white">
                          {selectedKeyInfo.type}
                        </span>
                      </CustomTooltip>
                      <CustomTooltip content="Size">
                        <span className="text-xs px-2 py-1 rounded-full border-2 border-tw-primary text-tw-primary dark:text-white">
                          {formatBytes(selectedKeyInfo.size)}
                        </span>
                      </CustomTooltip>
                      {selectedKeyInfo.collectionSize !== undefined && (
                        <CustomTooltip content="Collection size">
                          <span className="text-xs px-2 py-1 rounded-full border-2 border-tw-primary text-tw-primary dark:text-white">
                            {selectedKeyInfo.collectionSize.toLocaleString()}
                          </span>
                        </CustomTooltip>
                      )}
                      <CustomTooltip content="Delete">
                        <Button
                          className="mr-0.5"
                          onClick={handleDeleteModal}
                          variant={"destructiveGhost"}
                        >
                          <Trash />
                        </Button>
                      </CustomTooltip>
                    </div>
                  </div>
                  {isDeleteModalOpen && (
                    <DeleteModal
                      keyName={selectedKeyInfo.name}
                      onCancel={handleDeleteModal}
                      onConfirm={() => handleKeyDelete(selectedKeyInfo.name)}
                    />
                  )}
                  {/* TO DO: Refactor KeyBrowser and build smaller components */}
                  {/* Key Elements */}
                  <div className="flex items-center justify-center w-full p-4">
                    <table className="table-auto w-full overflow-hidden">
                      <thead className="bg-tw-dark-border opacity-85 text-white">
                        <tr>
                          <th className="w-1/2 py-3 px-4 text-left font-semibold">
                            {selectedKeyInfo.type === "list"
                              ? "Index"
                              : selectedKeyInfo.type === "string" ? "Value" : "Key"}
                          </th>
                          <th className="w-1/2 py-3 px-4 text-left font-semibold">
                            {selectedKeyInfo.type === "list"
                              ? "Elements" : selectedKeyInfo.type === "string" ? ""
                                : "Value"}
                          </th>
                          <th className="">
                            {isEditable && (selectedKeyInfo.type === "string" || selectedKeyInfo.type === "hash") ? (
                              <div className="flex gap-1">
                                <CustomTooltip content="Save">
                                  <Button
                                    onClick={handleSave}
                                    variant={"secondary"}
                                    className="text-tw-primary hover:text-tw-primary"
                                  >
                                    <Check />
                                  </Button>
                                </CustomTooltip>
                                <CustomTooltip content="Cancel">
                                  <Button
                                    onClick={handleEdit}
                                    variant={"destructiveGhost"}
                                  >
                                    <X />
                                  </Button>
                                </CustomTooltip>
                              </div>
                            ) : (
                              <CustomTooltip content="Edit">
                                <Button
                                  className="mr-1"
                                  onClick={handleEdit}
                                  variant={"ghost"}
                                  disabled={selectedKeyInfo.type !== "string" && selectedKeyInfo.type !== "hash"}
                                >
                                  <Pencil />
                                </Button>
                              </CustomTooltip>
                            )}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedKeyInfo.type === "string" ? (
                          <tr>
                            <td className="py-3 px-4 font-light dark:text-white" colSpan={2}>
                              {isEditable ? (
                                <textarea
                                  className="w-full p-2 dark:bg-tw-dark-bg dark:border-tw-dark-border border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                  value={editedValue}
                                  onChange={(e) => setEditedValue(e.target.value)}
                                  autoFocus
                                />
                              ) : (
                                <div className="whitespace-pre-wrap break-words">
                                  {selectedKeyInfo.elements}
                                </div>
                              )}
                            </td>
                          </tr>
                        ) : (
                          selectedKeyInfo.elements.map(
                            (element: ElementInfo, index: number) => (
                              <tr key={index}>
                                <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                                  {selectedKeyInfo.type === "list" || selectedKeyInfo.type === "set"
                                    ? index
                                    : element.key}
                                </td>
                                <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                                  {isEditable && selectedKeyInfo.type === "hash" ? (
                                    <input
                                      type="text"
                                      className="w-full p-2 dark:bg-tw-dark-bg dark:border-tw-dark-border border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      value={editedHashValue[element.key] || ""}
                                      onChange={(e) => handleHashFieldChange(element.key, e.target.value)}
                                    />
                                  ) : (
                                    selectedKeyInfo.type === "list" || selectedKeyInfo.type === "set"
                                      ? String(element)
                                      : element.value
                                  )}
                                </td>
                              </tr>
                            )
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="h-full p-4 text-sm font-light flex items-center justify-center text-gray-500">
                  Select a key to see details
                </div>
              )}
            </div>
          </div>
          {/* Key Details End */}
        </div>
      </TooltipProvider>
    </div>
  )
}
