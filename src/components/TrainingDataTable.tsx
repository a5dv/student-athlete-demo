"use client"

import { useState } from "react"
import type { TrainingData } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

interface TrainingDataTableProps {
  data: TrainingData[]
}

export function TrainingDataTable({ data: initialData }: TrainingDataTableProps) {
  const [data, setData] = useState(initialData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<TrainingData>>({})
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  const handleEdit = (id: string) => {
    setEditingId(id)
    setEditData(data.find((item) => item.id === id) || {})
  }

  const handleSave = async () => {
    if (!editingId) return

    const response = await fetch(`/api/training-data/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })

    if (response.ok) {
      const updatedItem = await response.json()
      setData(data.map((item) => (item.id === editingId ? updatedItem : item)))
      setEditingId(null)
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/training-data/${id}`, { method: "DELETE" })
    if (response.ok) {
      setData(data.filter((item) => item.id !== id))
      router.refresh()
    }
  }

  const handleAdd = async () => {
    const response = await fetch("/api/training-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })

    if (response.ok) {
      const newItem = await response.json()
      setData([newItem, ...data])
      setIsAdding(false)
      setEditData({})
      router.refresh()
    }
  }

  return (
    <div>
      <Button onClick={() => setIsAdding(true)} className="mb-4">
        Add New Entry
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Activity</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Duration (minutes)</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isAdding && (
            <TableRow>
              <TableCell>
                <Input
                  value={editData.activity || ""}
                  onChange={(e) => setEditData({ ...editData, activity: e.target.value })}
                  placeholder="Activity"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={editData.date ? format(new Date(editData.date), "yyyy-MM-dd") : ""}
                  onChange={(e) => setEditData({ ...editData, date: new Date(e.target.value) })}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={editData.durationInMinutes || ""}
                  onChange={(e) => setEditData({ ...editData, durationInMinutes: Number.parseFloat(e.target.value) })}
                  placeholder="Duration"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={editData.rating || ""}
                  onChange={(e) => setEditData({ ...editData, rating: Number.parseInt(e.target.value) })}
                  placeholder="Rating"
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button onClick={handleAdd}>Save</Button>
                  <Button variant="ghost" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    value={editData.activity || ""}
                    onChange={(e) => setEditData({ ...editData, activity: e.target.value })}
                  />
                ) : (
                  item.activity
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    type="date"
                    value={editData.date ? format(new Date(editData.date), "yyyy-MM-dd") : ""}
                    onChange={(e) => setEditData({ ...editData, date: new Date(e.target.value) })}
                  />
                ) : (
                  format(new Date(item.date), "yyyy-MM-dd")
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    type="number"
                    value={editData.durationInMinutes || 0}
                    onChange={(e) => setEditData({ ...editData, durationInMinutes: Number.parseFloat(e.target.value) })}
                  />
                ) : (
                  item.durationInMinutes
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    type="number"
                    value={editData.rating || 0}
                    onChange={(e) => setEditData({ ...editData, rating: Number.parseInt(e.target.value) })}
                  />
                ) : (
                  item.rating
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {editingId === item.id ? (
                    <>
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(item.id)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

