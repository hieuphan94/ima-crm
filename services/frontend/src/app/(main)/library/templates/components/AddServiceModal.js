'use client';

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

export default function AddServiceModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      classNames={{
        base: 'max-w-[500px]',
        body: 'py-3',
        header: 'py-3',
        footer: 'hidden',
        closeButton: 'right-2',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-row items-center">
          <span className="flex-1">Services Repository</span>
          <div className="mr-8">
            <Button color="primary" className="bg-green-700" size="sm" onPress={onClose}>
              Create
            </Button>
          </div>
        </ModalHeader>
        <ModalBody className="gap-4">
          {/* Language Selection */}
          <div className="flex gap-1.5">
            <div className="w-6 h-4 relative cursor-pointer hover:opacity-80">
              <Image src="/images/flags/fr.png" alt="French" width={24} height={24} />
            </div>
            <div className="w-6 h-4 relative cursor-pointer bg-blue-100">
              <Image src="/images/flags/en.png" alt="English" width={24} height={24} />
            </div>
            <div className="w-6 h-4 relative cursor-pointer hover:opacity-80">
              <Image src="/images/flags/de.png" alt="German" width={24} height={24} />
            </div>
          </div>

          {/* Photos Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span>Photos:</span>
              <a href="#" className="text-green-600 hover:underline text-sm">
                How to choose the right photos?
              </a>
            </div>
            <div className="border-2 border-dashed rounded-lg h-[60px] flex items-center justify-center">
              <div className="text-center flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Click or drag photos here</p>
              </div>
            </div>
          </div>

          {/* Name and Place Row */}
          <div className="grid grid-cols-[1.5fr,1fr] gap-4">
            <Input
              label="Name of service"
              placeholder="Enter name"
              variant="bordered"
              classNames={{
                inputWrapper: '!border-[0.5px] !border-gray-200',
              }}
              maxLength={255}
              endContent={<span className="text-gray-400 text-small">(0/255)</span>}
            />
            <Button
              startContent={<MapPin className="w-4 h-4" />}
              variant="bordered"
              className="w-full justify-start h-[56px] !border-[0.5px] !border-gray-200"
            >
              Add destination
            </Button>
          </div>

          {/* Type and Category Row */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Service type"
              placeholder="Select a type of service"
              variant="bordered"
              classNames={{
                trigger: '!border-[0.5px] !border-gray-200',
              }}
            >
              <SelectItem key="hotel">Hotel</SelectItem>
              <SelectItem key="resort">Resort</SelectItem>
              <SelectItem key="apartment">Apartment</SelectItem>
            </Select>

            <Select
              label="Category"
              placeholder="Select a category"
              variant="bordered"
              classNames={{
                trigger: '!border-[0.5px] !border-gray-200',
              }}
            >
              <SelectItem key="luxury">Luxury</SelectItem>
              <SelectItem key="standard">Standard</SelectItem>
              <SelectItem key="budget">Budget</SelectItem>
            </Select>
          </div>

          {/* Website */}
          <Input
            label="Website"
            placeholder="Enter website URL"
            variant="bordered"
            classNames={{
              inputWrapper: '!border-[0.5px] !border-gray-200',
            }}
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Add a description"
            variant="bordered"
            classNames={{
              inputWrapper: '!border-[0.5px] !border-gray-200',
            }}
            minRows={4}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
