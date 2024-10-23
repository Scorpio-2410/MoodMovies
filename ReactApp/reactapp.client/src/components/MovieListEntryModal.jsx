import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const MovieListEntryModal = ({ movie, onClose, onUpdate }) => {
  // State management
  const [updatedMovie, setUpdatedMovie] = useState(movie);
  const [rating, setRating] = useState(movie.rating || 0);

  // Function to handle updating the movie and closing the modal
  const handleUpdate = () => {
    onUpdate({ ...updatedMovie, rating });
    onClose();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold mb-2">
          Update Movie
        </DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-3 gap-6 ">
        {/* Movie poster */}
        <div className="col-span-1">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
            alt={movie.title}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        {/* Movie details form */}
        <div className="col-span-2 space-y-6">
          {/* Status dropdown */}
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Status:
            </label>
            <Select
              onValueChange={(value) =>
                setUpdatedMovie({ ...updatedMovie, status: value })
              }
              defaultValue={movie.status}
            >
              <SelectTrigger className="w-2/3">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="watched">Watched</SelectItem>
                <SelectItem value="watching">Watching</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Rating slider */}
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-gray-700">
              Rating:
            </label>
            <div className="w-2/3 space-y-2">
              <Slider
                min={0}
                max={10}
                step={0.1}
                value={[rating]}
                onValueChange={(value) => setRating(value[0])}
                className="w-full"
              />
              {/* Rating display */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>0</span>
                <span className="font-medium text-primary">
                  {rating.toFixed(1)}
                </span>
                <span>10</span>
              </div>
            </div>
          </div>
          {/* Notes textarea */}
          <div className="flex items-start">
            <label className="w-1/3 text-sm font-medium text-gray-700 pt-2">
              Notes:
            </label>
            <Textarea
              placeholder="Add your notes here"
              defaultValue={movie.notes}
              onChange={(e) =>
                setUpdatedMovie({ ...updatedMovie, notes: e.target.value })
              }
              className="w-2/3 min-h-[120px] resize-none"
            />
          </div>
          {/* Save button */}
          <div className="flex justify-end mt-8">
            <Button
              onClick={handleUpdate}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieListEntryModal;
