// styles/customStyles.ts
const customStyles = {
  control: (provided: any, { isFocused }: any) => ({
    ...provided,
    borderColor: isFocused ? 'teal' : 'gray.200',
    borderWidth: isFocused ? '2px' : '1px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: isFocused ? 'teal' : 'gray.200',
    },
    minHeight: '40px',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: 'teal',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: 'white',
    ':hover': {
      backgroundColor: 'darkred',
      color: 'white',
    },
  }),
  option: (provided: any, { isSelected, isFocused }: any) => ({
    ...provided,
    backgroundColor: isSelected ? 'teal' : isFocused ? 'lightgray' : 'white',
    color: isSelected ? 'white' : 'black',
    ':active': {
      backgroundColor: 'teal',
      color: 'white',
    },
  }),
};

export default customStyles;
