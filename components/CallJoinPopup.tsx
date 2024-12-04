import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CallJoinPopupProps {
  onAccept: () => void
  onReject: () => void
}

export function CallJoinPopup({ onAccept, onReject }: CallJoinPopupProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleAccept = () => {
    setIsOpen(false)
    onAccept()
  }

  const handleReject = () => {
    setIsOpen(false)
    onReject()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Call</DialogTitle>
          <DialogDescription>
            You are invited to join a call. Do you want to accept?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleReject}>Decline</Button>
          <Button onClick={handleAccept}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

