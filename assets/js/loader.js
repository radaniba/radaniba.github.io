/**
 * Page loader and progress animation
 * Displays animated loader while the page loads
 * Shows progress bar for navigation and async operations
 */

// DOM Elements
const loaderContainer = document.createElement('div');
loaderContainer.className = 'loader-container';

const loader = document.createElement('div');
loader.className = 'loader';

const spinner = document.createElement('div');
spinner.className = 'loader-spinner';

const pulse = document.createElement('div');
pulse.className = 'loader-pulse';
for (let i = 0; i < 3; i++) {
  const dot = document.createElement('span');
  pulse.appendChild(dot);
}

// Build loader DOM structure
loader.appendChild(spinner);
loaderContainer.appendChild(loader);
loaderContainer.appendChild(pulse);
document.body.appendChild(loaderContainer);

// Create progress bar
const progressBar = document.createElement('div');
progressBar.className = 'loader-progress';
document.body.appendChild(progressBar);

// Function to update progress bar
function updateProgress(value) {
  progressBar.style.width = `${value}%`;
  
  if (value >= 100) {
    setTimeout(() => {
      progressBar.style.opacity = '0';
      setTimeout(() => {
        progressBar.style.width = '0%';
        progressBar.style.opacity = '1';
      }, 300);
    }, 300);
  }
}

// Simulate page load progress
let progress = 0;
const progressInterval = setInterval(() => {
  progress += Math.random() * 10;
  
  if (progress > 100) {
    progress = 100;
    clearInterval(progressInterval);
    
    // Hide loader when page is fully loaded
    setTimeout(() => {
      loaderContainer.classList.add('hidden');
      setTimeout(() => {
        loaderContainer.style.display = 'none';
      }, 500);
    }, 500);
  }
  
  updateProgress(progress);
}, 200);

// Public API
window.pageLoader = {
  // Show loader
  show: function() {
    loaderContainer.style.display = 'flex';
    setTimeout(() => {
      loaderContainer.classList.remove('hidden');
    }, 10);
    progress = 0;
    updateProgress(0);
  },
  
  // Hide loader
  hide: function() {
    progress = 100;
    updateProgress(100);
    setTimeout(() => {
      loaderContainer.classList.add('hidden');
      setTimeout(() => {
        loaderContainer.style.display = 'none';
      }, 500);
    }, 300);
  },
  
  // Show progress for operation
  showProgress: function(callback) {
    let value = 0;
    progressBar.style.opacity = '1';
    progressBar.style.width = '0%';
    
    const interval = setInterval(() => {
      value += Math.random() * 3;
      if (value > 90) value = 90;
      
      updateProgress(value);
      
      if (value >= 90) {
        clearInterval(interval);
      }
    }, 100);
    
    const complete = () => {
      updateProgress(100);
      return callback ? callback() : null;
    };
    
    return { complete };
  },
  
  // Apply skeleton loading to elements
  applySkeletonLoading: function(selectors) {
    const elements = document.querySelectorAll(selectors);
    elements.forEach(element => {
      // Save original content
      element.dataset.originalContent = element.innerHTML;
      
      // Create skeleton structure based on element type
      if (element.tagName === 'IMG') {
        const width = element.width || element.clientWidth || 300;
        const height = element.height || element.clientHeight || 200;
        element.insertAdjacentHTML('afterend', `<div class="skeleton skeleton-image" style="width:${width}px;height:${height}px"></div>`);
        element.style.display = 'none';
      } else {
        // Create text skeletons
        const lines = element.textContent.split('\n').length || 3;
        let skeleton = '<div class="skeleton skeleton-title"></div>';
        
        for (let i = 0; i < lines; i++) {
          skeleton += '<div class="skeleton skeleton-text"></div>';
        }
        
        element.innerHTML = skeleton;
        element.classList.add('skeleton-container');
      }
    });
  },
  
  // Remove skeleton loading
  removeSkeletonLoading: function(selectors) {
    const elements = document.querySelectorAll(selectors);
    elements.forEach(element => {
      if (element.dataset.originalContent) {
        element.innerHTML = element.dataset.originalContent;
        element.classList.remove('skeleton-container');
        delete element.dataset.originalContent;
      }
      
      // Show original images
      if (element.tagName === 'IMG') {
        element.style.display = '';
        const nextSibling = element.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('skeleton-image')) {
          nextSibling.remove();
        }
      }
    });
  }
};

// Document ready event
document.addEventListener('DOMContentLoaded', () => {
  // Apply skeleton loading to selected elements
  pageLoader.applySkeletonLoading('.feature-card h3, .feature-card p, .testimonial-card p, .testimonial-card .author');
  
  // Gradually reveal content as it becomes ready
  setTimeout(() => {
    pageLoader.removeSkeletonLoading('.feature-card h3, .feature-card p');
  }, 800);
  
  setTimeout(() => {
    pageLoader.removeSkeletonLoading('.testimonial-card p, .testimonial-card .author');
  }, 1200);
  
  // Page navigation progress indicator
  document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only for internal links
      if (href && href.startsWith('/') && !href.startsWith('#')) {
        e.preventDefault();
        
        const progress = pageLoader.showProgress();
        
        setTimeout(() => {
          progress.complete();
          window.location.href = href;
        }, 500);
      }
    });
  });
}); 