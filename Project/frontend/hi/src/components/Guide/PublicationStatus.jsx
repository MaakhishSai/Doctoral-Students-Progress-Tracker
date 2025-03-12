const PublicationStatus = ({ status, className }) => {
    const getStatusStyles = () => {
      switch (status) {
        case 'Published':
          return {
            bg: 'bg-green-100', // Light green background
            text: 'text-green-800', // Dark green text
          };
        case 'Editorial Revised':
          return {
            bg: 'bg-yellow-100', // Light yellow background
            text: 'text-yellow-800', // Dark yellow text
          };
        case 'Submitted':
          return {
            bg: 'bg-blue-100', // Light blue background
            text: 'text-blue-800', // Dark blue text
          };
        default:
          return {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
          };
      }
    };
  
    const { bg, text } = getStatusStyles();
  
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text} ${className}`}
      >
        {status}
      </span>
    );
  };
  
  export default PublicationStatus;
  