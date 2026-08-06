/**
 * Stats Card Component
 * Displays statistics in a card format
 */

const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-100 dark:bg-primary-900/30',
      text: 'text-primary-600 dark:text-primary-400',
      gradient: 'from-primary-500 to-primary-600',
    },
    accent: {
      bg: 'bg-accent-100 dark:bg-accent-900/30',
      text: 'text-accent-600 dark:text-accent-400',
      gradient: 'from-accent-500 to-accent-600',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400',
      gradient: 'from-green-500 to-green-600',
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-600 dark:text-orange-400',
      gradient: 'from-orange-500 to-orange-600',
    },
  };

  const classes = colorClasses[color] || colorClasses.primary;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p className={`text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '+' : ''}{trend.value}%
            </p>
          )}
        </div>
        <div className={`p-4 ${classes.bg} rounded-2xl`}>
          <Icon className={`h-6 w-6 ${classes.text}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
