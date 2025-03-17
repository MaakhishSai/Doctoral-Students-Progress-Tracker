const PublicationStatus = ({ status, className }) => {
    const getStatusStyles = () => {
      switch (status) {
        case 'Published':
          return {
            bg: 'bg-blue-500', // Light green background
            text: 'text-white', // Dark green text
          };
        case 'Editorial Revision':
          return {
            bg: 'bg-yellow-500', // Light yellow background
            text: 'text-white', // Dark yellow text
          };
        case 'Submitted':
          return {
            bg: 'bg-gray-500', // Light blue background
            text: 'text-white', // Dark blue text
          };
        default:
          return {
            bg: 'bg-green-500',
            text: 'text-white',
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
  