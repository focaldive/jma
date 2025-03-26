import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, value, onChange, placeholder }: MultiSelectProps) {
  const handleChange = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      // Remove the selected value if it is already in the array
      onChange(value.filter((val) => val !== selectedValue))
    } else {
      // Add the selected value to the array
      onChange([...value, selectedValue])
    }
  }

  return (
    <div>
      <Select onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || "Select options"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
